# Run once after closing Cursor (nested PMS folder is locked while IDE is open).
$nested = 'D:\My Websites\PMS\PMS'
if (-not (Test-Path $nested)) {
  Write-Host 'Nothing to remove — nested PMS folder already gone.'
  exit 0
}
$items = Get-ChildItem -LiteralPath $nested -Force -ErrorAction SilentlyContinue
if ($items.Count -gt 0) {
  Write-Error "Refusing to delete — folder is not empty: $nested"
  exit 1
}
Remove-Item -LiteralPath $nested -Force
Write-Host "Removed empty nested folder: $nested"
