param(
  [Parameter(Mandatory = $true)]
  [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
  [string]$ApkPath,

  [string]$Destination = "",

  [string]$UploadedAt = "",

  [string]$BucketName = "vintage-apk-downloads"
)

$scriptRoot = if ($PSScriptRoot) {
  $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
  Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
  Get-Location
}

$source = Resolve-Path -LiteralPath $ApkPath

if ($Destination) {
  $target = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Destination)
  $targetDir = Split-Path -Parent $target

  if (-not (Test-Path -LiteralPath $targetDir -PathType Container)) {
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
  }

  Copy-Item -LiteralPath $source -Destination $target -Force
  Write-Host "Copied APK to $target"
}

if (-not $UploadedAt) {
  $UploadedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
}

$npx = "C:\Program Files\nodejs\npx.cmd"
if (-not (Test-Path -LiteralPath $npx -PathType Leaf)) {
  $npx = "npx"
}

$sourceItem = Get-Item -LiteralPath $source
$metadataPath = Join-Path ([IO.Path]::GetTempPath()) "latest-apk.json"
$metadata = @{
  uploadedAt = $UploadedAt
  size = $sourceItem.Length
  name = "latest.apk"
} | ConvertTo-Json -Compress
Set-Content -LiteralPath $metadataPath -Value $metadata -Encoding ASCII

& $npx wrangler r2 object put "$BucketName/latest.apk" --file $source --content-type "application/vnd.android.package-archive" --content-disposition 'attachment; filename="latest.apk"' --cache-control "no-store" --remote --force
if ($LASTEXITCODE -ne 0) {
  throw "Failed to upload latest.apk to R2"
}

& $npx wrangler r2 object put "$BucketName/latest-apk.json" --file $metadataPath --content-type "application/json; charset=utf-8" --cache-control "no-store" --remote --force
if ($LASTEXITCODE -ne 0) {
  throw "Failed to upload latest-apk.json to R2"
}

Remove-Item -LiteralPath $metadataPath -Force -ErrorAction SilentlyContinue
Write-Host "Uploaded latest.apk to R2 at $UploadedAt"
