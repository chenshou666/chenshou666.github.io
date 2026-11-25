# 版本记录与退回旧版本指南

本仓库保持干净的单分支结构（仅保留 `main`），同时通过 **Git 标签（Tag）** 保存关键里程碑快照，并在站内提供开屏动画即时切换功能。

---

## 版本里程碑

| 标签（Tag） | 说明 |
| --- | --- |
| `v1.0-legacy` | 仓库大整理与开屏动画升级前的原始完整快照（commit `b62c263`） |
| `v2.0-reorg-splash` | 第一版仓库整理与液态玻璃开屏动画上线 |
| `v2.1-content-and-warp-splash` | 全新「极光跃迁」纯动画极简开屏、CSS/JS 深度去重整理、C 86 关零基础升级与四级 62 关全量质量修复 |

---

## 方式一：站内切换开屏动画（无需改代码）

1. 打开网站 → 点击顶栏右侧 **「⚙ 外观」** → 在「开屏动画」下拉框中可随时切换：
   - `极光跃迁（新版）`：默认纯动画极简开屏
   - `经典简洁（旧版）`：退回经典 HT 玻璃卡片开屏
   - `关闭开屏`：直达主页
   - 点击 **「▶ 重播开屏」** 即可实时预览对比。
2. 也支持网址参数临时预览：`?splash=cinema` / `?splash=classic` / `?splash=off`。

---

## 方式二：通过 Git 标签安全退回任意历史版本

> 推荐采用“保留提交历史、生成一条还原提交”的方式，随时可再切回新版：

```bash
# 1. 拉取全部标签
git fetch --all --tags

# 2. 用目标标签（如 v1.0-legacy）的完整文件内容还原工作区
git checkout main
git rm -rf .
git checkout v1.0-legacy -- .

# 3. 确认并提交推送，GitHub Pages 自动重新发布
git status
git commit -m "revert: 退回至旧版本 (v1.0-legacy)"
git push origin main
```

### 仅撤销某一次单独提交
```bash
git log --oneline -n 6
git revert <commit-hash>
git push origin main
```
