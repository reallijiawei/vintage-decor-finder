param(
  [switch]$KeepDeployDir
)

$scriptRoot = if ($PSScriptRoot) {
  $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Path) {
  Split-Path -Parent $MyInvocation.MyCommand.Path
} else {
  Get-Location
}

$repoRoot = Resolve-Path -LiteralPath (Join-Path $scriptRoot "..")
$deployDir = Join-Path $repoRoot ".worker-deploy"
$publicDir = Join-Path $deployDir "public"

if (Test-Path -LiteralPath $deployDir) {
  Remove-Item -LiteralPath $deployDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $publicDir | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $deployDir "src") | Out-Null

$assetRoots = @("assets", "styles", "rooms", "keywords", "guides", "apk")
foreach ($assetRoot in $assetRoots) {
  $sourceDir = Join-Path $repoRoot $assetRoot
  if (Test-Path -LiteralPath $sourceDir -PathType Container) {
    Copy-Item -LiteralPath $sourceDir -Destination (Join-Path $publicDir $assetRoot) -Recurse -Force
  }
}

$rootAssets = @(
  "about.html",
  "contact.html",
  "privacy.html",
  "terms.html",
  "affiliate-disclosure.html",
  "index.html",
  "apk-page.txt",
  "apk-tools.js",
  "app.js",
  "styles.css",
  "marketplaces.js",
  "tracking.js",
  "favicon.svg",
  "site.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "latest.apk"
)

foreach ($asset in $rootAssets) {
  $source = Join-Path $repoRoot $asset
  if (Test-Path -LiteralPath $source -PathType Leaf) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $publicDir $asset) -Force
  }
}

Copy-Item -LiteralPath (Join-Path $repoRoot "src\worker.js") -Destination (Join-Path $deployDir "src\worker.js") -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "wrangler.jsonc") -Destination (Join-Path $deployDir "wrangler.jsonc") -Force
(Get-Content (Join-Path $deployDir "wrangler.jsonc")) -replace '"directory": "\."', '"directory": "./public"' | Set-Content (Join-Path $deployDir "wrangler.jsonc") -Encoding ASCII

$npx = "C:\Program Files\nodejs\npx.cmd"
if (-not (Test-Path -LiteralPath $npx -PathType Leaf)) {
  $npx = "npx"
}

Push-Location $repoRoot
try {
  & $npx wrangler deploy --config (Join-Path $deployDir "wrangler.jsonc") 2>&1 | ForEach-Object {
    Write-Host $_
  }
  if ($LASTEXITCODE -ne 0) {
    throw "wrangler deploy failed with exit code $LASTEXITCODE"
  }
} finally {
  Pop-Location
  if (-not $KeepDeployDir -and (Test-Path -LiteralPath $deployDir)) {
    Remove-Item -LiteralPath $deployDir -Recurse -Force
  }
}
