param(
  [Parameter(Mandatory = $true)]
  [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
  [string]$ApkPath,

  [string]$Destination = "",

  [string]$UploadedAt = "",

  [switch]$Deploy
)

$scriptRoot = if ($PSScriptRoot) {
  $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
  Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
  Get-Location
}

if (-not $Destination) {
  $Destination = Join-Path $scriptRoot "..\latest.apk"
}

$source = Resolve-Path -LiteralPath $ApkPath
$target = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Destination)
$targetDir = Split-Path -Parent $target

if (-not (Test-Path -LiteralPath $targetDir -PathType Container)) {
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

Copy-Item -LiteralPath $source -Destination $target -Force
Write-Host "Copied APK to $target"

if (-not $UploadedAt) {
  $UploadedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot "..")
$pagePaths = @(
  (Join-Path $repoRoot "apk-page.txt"),
  (Join-Path $repoRoot "apk\index.html")
)

foreach ($pagePath in $pagePaths) {
  if (Test-Path -LiteralPath $pagePath -PathType Leaf) {
    $content = Get-Content -LiteralPath $pagePath -Raw
    $content = $content -replace 'Uploaded: [^<]+', "Uploaded: $UploadedAt"
    Set-Content -LiteralPath $pagePath -Value $content -Encoding ASCII
  }
}

Write-Host "Updated APK upload time to $UploadedAt"

if ($Deploy) {
  & (Join-Path $scriptRoot "deploy-worker-assets.ps1")
}
