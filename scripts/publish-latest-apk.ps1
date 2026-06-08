param(
  [Parameter(Mandatory = $true)]
  [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
  [string]$ApkPath,

  [string]$Destination = ""
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
