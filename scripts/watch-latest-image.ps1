param(
  [string]$ApiUrl = "https://vintagedecorfinder.com/api/device-images",
  [string]$DownloadUrl = "https://vintagedecorfinder.com/latest.png",
  [string]$Destination = "D:\data\AI\codex_projects\remote_codex\latest.png",
  [int]$IntervalSeconds = 15,
  [switch]$Once
)

$ErrorActionPreference = "Stop"
$scriptRoot = if ($PSScriptRoot) { $PSScriptRoot } elseif ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { Get-Location }
$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot "..")
$logPath = Join-Path $repoRoot "latest-image-watcher.log"
$statePath = Join-Path $repoRoot ".latest-image-state.txt"

function Write-Log {
  param([string]$Message)
  $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
  Write-Host $line
}

function Sync-LatestImage {
  try {
    $response = Invoke-RestMethod -Uri $ApiUrl -Method Get
    $image = @($response.images)[0]
    if (-not $image) {
      Write-Log "No latest.png uploaded yet"
      return
    }

    $fingerprint = "{0}|{1}" -f $image.uploadedAt, $image.size
    $oldFingerprint = if (Test-Path -LiteralPath $statePath) { (Get-Content -LiteralPath $statePath -Raw).Trim() } else { "" }

    if ($oldFingerprint -eq $fingerprint -and (Test-Path -LiteralPath $Destination -PathType Leaf)) {
      return
    }

    $targetDir = Split-Path -Parent $Destination
    if (-not (Test-Path -LiteralPath $targetDir -PathType Container)) {
      New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }

    & curl.exe --fail --location --silent --show-error --output $Destination $DownloadUrl
    if ($LASTEXITCODE -ne 0) {
      throw "curl download failed with exit code $LASTEXITCODE"
    }

    $downloaded = Get-Item -LiteralPath $Destination
    if ($downloaded.Length -le 0) {
      throw "Downloaded latest.png is empty"
    }

    Set-Content -LiteralPath $statePath -Value $fingerprint -Encoding ASCII
    Write-Log "Downloaded latest.png to $Destination; uploadedAt=$($image.uploadedAt); size=$($downloaded.Length)"
  } catch {
    Write-Log "ERROR: $($_.Exception.Message)"
  }
}

Write-Log "Watching remote latest.png"
Sync-LatestImage

if ($Once) {
  exit 0
}

while ($true) {
  Start-Sleep -Seconds $IntervalSeconds
  Sync-LatestImage
}
