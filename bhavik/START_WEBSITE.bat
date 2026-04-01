@echo off
echo ===================================================
echo   ENTERTAINMENT HUB - LOCAL SERVER
echo ===================================================
echo.
echo Aapka server start ho raha hai...
echo.
echo Apne PHONE ya kisi aur LAPTOP par website kholne ke liye 
echo niche diya gaya "IPv4 Address" apne browser mein type karein:
echo.
echo Example: http://192.168.1.x:8000
echo.
echo ---------------------------------------------------
ipconfig | findstr "IPv4"
echo ---------------------------------------------------
echo.
echo (Dhyan rahe: Aapka phone aur laptop same Wi-Fi par hone chahiye)
echo.

:: Check if Python is installed
python --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [Python server started on port 8000]
    python -m http.server 8000 --bind 0.0.0.0
    pause
    exit /b
)

:: Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [Node.js server started on port 8000 using npx...]
    call npx serve -l 8000
    pause
    exit /b
)

:: If neither is installed, use a fallback temporary PowerShell local server
echo Python ya Node.js nahi mila. Powershell Local Server start kar rahe hain...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://*:8000/'); $listener.Start(); Write-Host 'Listening on port 8000...'; while ($listener.IsListening) { $context = $listener.GetContext(); $response = $context.Response; $request = $context.Request; $localPath = '.' + $request.Url.LocalPath; if ($localPath -eq './') { $localPath = './index.html' }; if (Test-Path $localPath -PathType Leaf) { $content = [System.IO.File]::ReadAllBytes($localPath); $response.ContentLength64 = $content.Length; if ($localPath.EndsWith('.css')) { $response.ContentType = 'text/css' } elseif ($localPath.EndsWith('.js')) { $response.ContentType = 'application/javascript' } else { $response.ContentType = 'text/html' }; $response.OutputStream.Write($content, 0, $content.Length) } else { $response.StatusCode = 404 }; $response.Close() }"
pause
