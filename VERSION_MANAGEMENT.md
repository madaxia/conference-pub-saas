# 版本管理指南

## 当前版本: v1.0.0

## 常用命令

### 查看版本列表
```bash
git tag -l
```

### 查看版本历史
```bash
git log --oneline
git log --oneline --graph --all
```

### 切换到指定版本
```bash
# 切换到v1.0.0
git checkout v1.0.0

# 切换到特定提交
git checkout <commit-hash>
```

### 创建新版本
```bash
# 1. 修改代码后，添加文件
git add .

# 2. 提交
git commit -m "描述本次修改"

# 3. 创建标签
git tag -a v1.0.1 -m "版本描述"

# 4. 推送到远程
git push origin v1.0.1
```

### 回到最新版本
```bash
git checkout master
```

### 查看版本差异
```bash
# 查看当前与v1.0.0的差异
git diff v1.0.0

# 查看两个版本之间的差异
git diff v1.0.0..v1.0.1
```

## 版本命名规则

格式: `v主版本.次版本.修订号`

- 主版本: 重大架构变更
- 次版本: 新功能
- 修订号: bug修复、小修改

## 备份

项目已自动备份到Git，每次提交都是一次备份。
