@echo off
echo Syncing files from source to public directory...

REM Clear existing files in public (except .git and node_modules)
REM This ensures removed files don't stick around
echo Cleaning public directory...
if exist public (
  rd /s /q public\js 2>nul
  rd /s /q public\css 2>nul
  rd /s /q public\assets 2>nul
  rd /s /q public\pages 2>nul
  rd /s /q public\src 2>nul
)

REM Create directories if they don't exist
mkdir public\js 2>nul
mkdir public\css 2>nul
mkdir public\assets 2>nul
mkdir public\pages 2>nul
mkdir public\src 2>nul
mkdir public\src\scripts 2>nul
mkdir public\src\scripts\features 2>nul
mkdir public\src\scripts\utils 2>nul
mkdir public\src\scripts\core 2>nul
mkdir public\src\firebase 2>nul
mkdir public\src\firebase\services 2>nul
mkdir public\src\firebase\ui-services 2>nul

REM Copy files from root to public
copy index.html public\ /Y
copy module-test.html public\ /Y
copy test-modules.js public\ /Y

REM Copy directories with all contents
xcopy js\*.* public\js\ /E /Y
xcopy css\*.* public\css\ /E /Y
xcopy assets\*.* public\assets\ /E /Y
xcopy pages\*.* public\pages\ /E /Y
xcopy src\*.* public\src\ /E /Y

echo Files synchronized successfully!
