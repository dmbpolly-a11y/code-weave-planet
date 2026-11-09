@echo off
cls
echo ========================================================
echo   CODE WEAVE PLANET - FAST DEPLOY TO VERCEL & GITHUB
echo ========================================================
echo.

echo 1. Staging and committing changes...
git add .
set /p commit_msg="Enter commit message (or press enter for default): "
if "%commit_msg%"=="" set commit_msg=Update Code Weave Planet application
git commit -m "%commit_msg%"

echo.
echo 2. Pushing to GitHub (main branch)...
git push origin main

echo.
echo 3. Deploying directly to Vercel Production...
vercel --prod --yes

echo.
echo ========================================================
echo   DEPLOYMENT COMPLETE!
echo   Live URL: https://code-weave-planet.vercel.app
echo ========================================================
pause
