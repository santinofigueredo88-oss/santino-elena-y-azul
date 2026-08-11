@echo off
title Publicar pagina - Que Cocino
cd /d "%~dp0"

echo ============================================
echo   PUBLICAR LA PAGINA EN LINEA
echo ============================================
echo.

git add -A
git diff --cached --quiet
if not %errorlevel%==0 goto haycambios

echo No hay cambios nuevos para publicar.
echo La pagina ya esta actualizada con todo.
echo.
goto push

:haycambios
set MSG=Publicacion automatica %date% %time%
git commit -m "%MSG%"
echo Cambios listos, subiendo...

:push
echo.
echo Subiendo a GitHub...
git push
if %errorlevel%==0 goto ok

echo.
echo ERROR: no se pudo subir. Chequea que estes conectado a internet
echo y que la carpeta no este bloqueada, y volve a intentar.
echo.
goto fin

:ok
echo.
echo ============================================
echo   LISTO! La pagina se esta actualizando sola.
echo   En ~1 minuto vas a ver los cambios en:
echo   https://pagina-five-vert.vercel.app
echo ============================================

:fin
echo.
pause
