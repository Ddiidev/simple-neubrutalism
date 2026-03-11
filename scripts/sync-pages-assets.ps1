$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$docsRoot = Join-Path $repoRoot 'docs'
$docsTags = Join-Path $docsRoot 'tags'

New-Item -ItemType Directory -Force $docsTags | Out-Null

Copy-Item -Force (Join-Path $repoRoot 'neubrutalism.css') (Join-Path $docsRoot 'neubrutalism.css')
Copy-Item -Force (Join-Path $repoRoot 'neubrutalism.js') (Join-Path $docsRoot 'neubrutalism.js')
Copy-Item -Force (Join-Path $repoRoot 'tags\*') $docsTags

Write-Host 'GitHub Pages assets synced into docs/.'
