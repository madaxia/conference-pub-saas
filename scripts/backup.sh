#!/bin/bash

# 会议出版平台 - 版本备份脚本

cd "$(dirname "$0")"

VERSION=${1:-$(date +"%Y.%m.%d-%H%M%S")}
MESSAGE=${2:-"手动备份"}

echo "=== 会议出版平台 备份脚本 ==="
echo "版本: $VERSION"
echo "信息: $MESSAGE"
echo ""

# 添加所有修改
git add -A

# 检查是否有修改
if git diff --cached --quiet; then
    echo "没有需要提交的修改"
    exit 0
fi

# 提交
git commit -m "$MESSAGE"

# 创建标签
git tag -a "v$VERSION" -m "备份: $MESSAGE"

echo ""
echo "=== 备份完成 ==="
echo "版本: v$VERSION"
echo ""
echo "查看版本: git tag -l"
echo "查看历史: git log --oneline"
