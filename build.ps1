$buildFolder = "Content-Aware.zip"
$manifestFile = "./manifest.json"
if(Test-Path $buildFolder) {Remove-Item $buildFolder}
$manifest = (Get-Content -Path $manifestFile -Raw) | ConvertFrom-Json;
[array]$version = foreach($number in $manifest.version.split('.')) {
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
Get-ChildItem ./ | ForEach-Object { 
    if($_.Name -ne ".git" -and $_.Name -ne $buildFolder -and $_.Name -ne $myInvocation.MyCommand) 
    {
        Compress-Archive -Path $_.FullName -DestinationPath ./$buildFolder -Update
    }
}