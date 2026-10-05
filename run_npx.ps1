$nodeDir = "C:\Users\Nirmal Chathuranga\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64"
$env:PATH = "$nodeDir;$env:PATH"
& "$nodeDir\npx.cmd" @args
