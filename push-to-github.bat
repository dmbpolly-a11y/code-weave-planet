@echo off
title Push Code Weave Planet to GitHub
color 0A
echo ============================================================
echo   CODE WEAVE PLANET - PUSHING ALL COMMITS TO GITHUB
echo ============================================================
echo.
echo Target Repository: https://github.com/dmbpolly-a11y/Code-Weave-Planet.git
echo Branch: main
echo.
echo If a GitHub browser login window appears, please click "Sign In"
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ============================================================
    echo   SUCCESS! All code has been pushed to GitHub!
    echo ============================================================
) else (
    color 0C
    echo ============================================================
    echo   Push encountered an error. If prompted, please authorize
    echo   GitHub in the popup window and try again.
    echo ============================================================
)
echo.
pause
