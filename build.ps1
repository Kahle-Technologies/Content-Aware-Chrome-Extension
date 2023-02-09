
[string]$manifestFile = "./manifest.json"
[object]$manifest = (Get-Content -Path $manifestFile -Raw) | ConvertFrom-Json;

[array]$version = foreach ($number in $manifest.version.split('.')) {
    try {
        [int]::parse($number)
    }
    catch {
        Invoke-Expression -Command $number;
    }
}
$version[-1]++
$manifest.version = $version -join "."

ConvertTo-Json $manifest -depth 10 | Out-File $manifestFile -Force

[string]$buildFolder = "Content-Aware-BuildVersion-$($manifest.version).zip"
if (Test-Path $buildFolder) { Remove-Item $buildFolder }

Get-ChildItem ./ | ForEach-Object { 
    if ($_.Name -ne ".git" -and $_.Name -ne ".gitignore" -and $_.Name -ne $buildFolder -and $_.Name -ne $myInvocation.MyCommand) {
        Compress-Archive -Path $_.FullName -DestinationPath ./$buildFolder -Update
    }
}