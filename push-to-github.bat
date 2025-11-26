@echo off
REM Script to push SnapLink to GitHub
REM This uses the credential helper to securely store your token

cd /d "c:\Users\Hack3r\OneDrive\Desktop\PROJECTS\snaplink"

echo Configuring Git for secure credential storage...
git config --global credential.helper store

echo.
echo Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/rjbutt203-web/snaplink.git

echo.
echo Your remote is configured as:
git remote -v

echo.
echo Ready to push! When prompted for password, use your Personal Access Token.
echo.
echo Pushing code to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Your code is now on GitHub!
    echo Visit: https://github.com/rjbutt203-web/snaplink
) else (
    echo.
    echo ❌ Push failed. Check the error above.
    pause
)
