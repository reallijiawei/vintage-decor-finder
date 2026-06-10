param(
  [string]$ApkPath = "D:\data\AI\codex_projects\android_apk_build\mibby\app\build\outputs\apk\debug\app-debug.apk",
  [int]$DebounceSeconds = 8,
  [switch]$SkipInitialPublish,
  [switch]$Once
)

$ErrorActionPreference = "Stop"

$scriptRoot = if ($PSScriptRoot) {
  $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
  Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
  Get-Location
}

$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot "..")
$publishScript = Join-Path $scriptRoot "publish-latest-apk.ps1"
$logPath = Join-Path $repoRoot "apk-publisher.log"
$statePath = Join-Path $repoRoot ".apk-publisher-state.txt"

function Write-Log {
  param([string]$Message)
  $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
  Write-Host $line
}

function Wait-FileStable {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "APK does not exist: $Path"
  }

  $previous = $null
  for ($i = 0; $i -lt 60; $i++) {
    $item = Get-Item -LiteralPath $Path
    $current = "{0}|{1}" -f $item.Length, $item.LastWriteTimeUtc.Ticks
    if ($previous -eq $current) {
      return $item
    }
    $previous = $current
    Start-Sleep -Seconds 2
  }

  throw "APK did not become stable within 120 seconds: $Path"
}

function Publish-Apk {
  param([string]$Reason)

  try {
    $item = Wait-FileStable -Path $ApkPath
    $fingerprint = "{0}|{1}" -f $item.Length, $item.LastWriteTimeUtc.Ticks
    $oldFingerprint = if (Test-Path -LiteralPath $statePath) { Get-Content -LiteralPath $statePath -Raw } else { "" }

    if ($oldFingerprint.Trim() -eq $fingerprint) {
      Write-Log "Skip unchanged APK after $Reason"
      return
    }

    if (-not $env:CLOUDFLARE_API_TOKEN) {
      throw "CLOUDFLARE_API_TOKEN is not available in this process; Wrangler cannot deploy automatically."
    }

    $uploadedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Log "Publishing APK after $Reason; size=$($item.Length); uploadedAt=$uploadedAt"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $publishScript -ApkPath $ApkPath -UploadedAt $uploadedAt 2>&1 | ForEach-Object {
      Write-Log "publish: $_"
    }
    if ($LASTEXITCODE -ne 0) {
      throw "publish script failed with exit code $LASTEXITCODE"
    }

    Set-Content -LiteralPath $statePath -Value $fingerprint -Encoding ASCII
    Write-Log "Published APK successfully"
  } catch {
    Write-Log "ERROR: $($_.Exception.Message)"
  }
}

$apkDir = Split-Path -Parent $ApkPath
$apkName = Split-Path -Leaf $ApkPath

if (-not (Test-Path -LiteralPath $apkDir -PathType Container)) {
  throw "APK directory does not exist: $apkDir"
}

Write-Log "Watching $ApkPath"

if (-not $SkipInitialPublish) {
  Publish-Apk -Reason "startup"
}

if ($Once) {
  exit 0
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $apkDir
$watcher.Filter = $apkName
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, Size, CreationTime'
$watcher.EnableRaisingEvents = $true
$subscriptions = @()
$subscriptions += Register-ObjectEvent -InputObject $watcher -EventName Changed -SourceIdentifier ApkChanged
$subscriptions += Register-ObjectEvent -InputObject $watcher -EventName Created -SourceIdentifier ApkCreated
$subscriptions += Register-ObjectEvent -InputObject $watcher -EventName Renamed -SourceIdentifier ApkRenamed

try {
  while ($true) {
    $event = Wait-Event -Timeout 1
    if (-not $event) {
      continue
    }

    Remove-Event -EventIdentifier $event.EventIdentifier -ErrorAction SilentlyContinue
    Start-Sleep -Seconds $DebounceSeconds
    Publish-Apk -Reason $event.SourceEventArgs.ChangeType
  }
} finally {
  foreach ($subscription in $subscriptions) {
    Unregister-Event -SubscriptionId $subscription.Id -ErrorAction SilentlyContinue
  }
  $watcher.EnableRaisingEvents = $false
  $watcher.Dispose()
}
