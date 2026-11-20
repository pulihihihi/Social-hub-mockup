@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"

pushd "%SCRIPT_DIR%" >nul

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Khong tim thay Git tren may nay.
  goto :fail
)

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Thu muc nay khong phai git repo.
  goto :fail
)

for /f "delims=" %%i in ('git branch --show-current') do set "BRANCH=%%i"
if not defined BRANCH (
  echo [ERROR] Khong xac dinh duoc branch hien tai.
  goto :fail
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Repo nay chua co remote origin.
  echo [ERROR] Flow moi chi push len internal git qua origin.
  goto :fail
)

set "HAS_CHANGES="
for /f "delims=" %%i in ('git status --porcelain') do (
  set "HAS_CHANGES=1"
  goto :after_status
)
:after_status
if defined HAS_CHANGES (
  echo [ERROR] Ban dang co file chua commit.
  echo [ERROR] Script nay chi push phan da commit. Hay commit truoc roi chay lai.
  goto :fail
)

echo [INFO] Dang push branch %BRANCH% len origin (internal git)...
git push -u origin %BRANCH%
if errorlevel 1 goto :fail

echo [DONE] Da push len origin thanh cong.
goto :success

:fail
popd >nul
exit /b 1

:success
popd >nul
exit /b 0
