$d = 'C:\Users\utilisateur\Downloads\make-the-change-main\make-the-change-main\repo-propre5\apps\web-client\src\lib\mock'
$orig = Join-Path $d 'mock-academy.ts'
$new  = Join-Path $d 'mock-academy.ts.new'

Copy-Item $new $orig -Force
Remove-Item $new -Force -ErrorAction SilentlyContinue
foreach ($f in @('ch1.ts','ch2.ts','ch3.ts','ch4.ts','ch5.ts','assemble.ps1')) {
    $p = Join-Path $d $f
    if (Test-Path $p) { Remove-Item $p -Force }
}

$count = (Get-Content $orig -Encoding UTF8).Count
Write-Host "Final mock-academy.ts: $count lines"
