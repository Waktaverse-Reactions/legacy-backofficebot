#!/bin/bash
. /home/dos0313/.bashrc

date=$(date)
github_id=$env_github_id
github_Token=$env_github_Token
github_Address=$env_Project_git
logFile="/home/dos0313/push_log/${Project_name}_push.log"
SourceDir=$env_Project_Dir

cd $SourceDir || exit 1  # 디렉토리 변경 실패 시 스크립트 종료

if [ ! -d "$SourceDir/.git" ]; then
  echo "Error: Not a git repository"
  exit 1
fi

git pull https://$github_id:$github_Token@$github_Address || exit 1
git add .
echo "shell : git add" >> "$logFile" 2>&1
git commit -m "[$date] post commit"
echo "shell : git commit [$date]" >> "$logFile" 2>&1
git push https://$github_id:$github_Token@$github_Address || exit 1
echo "shell : git push" >> "$logFile" 2>&1

sleep 2

echo "shell script exit" >> "$logFile"

exit 0
