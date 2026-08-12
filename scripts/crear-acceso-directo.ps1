# Crea el acceso directo "Publicar" en el escritorio de Windows
$desktop = [Environment]::GetFolderPath('Desktop')
$proyecto = 'C:\Users\pc-3\pagina'
$lnk = Join-Path $desktop 'Publicar - Que Cocino.lnk'

$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut($lnk)
$s.TargetPath = Join-Path $proyecto 'Publicar.bat'
$s.WorkingDirectory = $proyecto
$s.Description = 'Sube los cambios de la pagina a GitHub y publica en Vercel'
$s.Save()

Write-Output "Acceso directo creado en: $lnk"
