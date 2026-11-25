# 版本记录与退回旧版本指南

本仓库为关键版本保留了完整的 **备份分支** 与 **Git 标签（Tag）**，并在站内提供了开屏动画即时切换功能。无论你是只想换回旧版开屏，还是把整个网站完整退回到整理前的旧版本，都可以安全无损操作。

---

## 版本基线一览

| 标识 | 类型 | 对应提交 | 说明 |
| --- | --- | --- | --- |
| `v1.0-legacy` | Git Tag | `b62c263` | 仓库整理与新开屏动画上线前的**原始完整快照** |
| `backup/legacy-v1` | Git 分支 | `b62c263` | 与 `v1.0-legacy` 完全一致的远端备份分支，可供 GitHub Pages 一键切回 |
| `v2.0-reorg-splash` | Git Tag | `main` 最新 | 仓库结构与文档全面整理 + 全新「极光棱镜」可切换开屏动画 |

---

## 方式一：只退回旧版开屏动画（无需改代码 / 无需重新部署）

网站内置了开屏动画切换器，**不改动仓库即可立即切换**：

1. **站内切换**：打开网站 → 点击顶栏右侧 **「⚙ 外观」** → 在「开屏动画」下拉框中选择：
   - `极光棱镜（新版）`：默认的新版液态玻璃粒子开屏
   - `经典简洁（旧版）`：退回原有的简洁 HT 玻璃卡片开屏
   - `关闭开屏`：打开即直达主页
   - 点击 **「▶ 重播开屏」** 可立刻预览对比。
2. **网址参数临时预览**：
   - 预览新版：`https://chenshou666.github.io/?splash=cinema`
   - 退回旧版：`https://chenshou666.github.io/?splash=classic`
   - 跳过开屏：`https://chenshou666.github.io/?splash=off`

---

## 方式二：GitHub 网页端零命令行一键退回整站（最简单）

如果你想让线上 `https://chenshou666.github.io/` 立刻恢复成整理前的原始旧版本，又不想敲 Git 命令：

1. 打开仓库页面：`https://github.com/chenshou666/chenshou666.github.io`
2. 进入顶部菜单 **Settings** → 左侧 **Pages**
3. 在 **Build and deployment → Branch** 中，把分支从 `main` 改为 **`backup/legacy-v1`**，目录保持 `/ (root)`，点击 **Save**
4. 等待约 1 分钟，强刷 `https://chenshou666.github.io/` 即可看到完全还原的旧版本。
5. 以后想切回新版，只需要再把分支改回 `main` 即可。

---

## 方式三：使用 Git 命令行将 `main` 安全回退到旧版本（推荐开发方式）

> **推荐做法：保留提交历史，生成一条“还原为旧版本”的新提交**（不会破坏 Git 历史，随时还能再恢复新版）。

```bash
# 1. 确保已拉取全部标签与最新分支
git fetch --all --tags

# 2. 用 v1.0-legacy 的完整文件内容覆盖当前工作区（保留 .git 历史）
git checkout main
git rm -rf .
git checkout v1.0-legacy -- .

# 3. 确认改动并提交推送，GitHub Pages 会自动重新部署旧版本
git status
git commit -m "revert: 退回至整理前旧版本 (v1.0-legacy)"
git push origin main
```

### 如果只回退某一个单独改动（例如只撤销开屏动画、保留文档整理）

因为本次整理把「仓库清理与文档」和「新开屏动画」拆成了独立提交，你也可以只撤销其中一条 commit：

```bash
git log --oneline -n 5
# 找到目标 commit 哈希后执行（不会丢失其它改动）：
git revert <commit-hash>
git push origin main
```

### 仅在本地临时查看旧版本代码（不改 `main`）

```bash
git checkout v1.0-legacy
# 双击 index.html 即可预览旧版本；看完切回 main：
git checkout main
```
