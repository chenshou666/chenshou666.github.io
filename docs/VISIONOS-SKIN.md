# visionOS 皮肤说明（css/08-visionos.css）

## 一句话

只给「星空 UI（3D 星尘粒子宇宙）」换了一层 Apple Vision Pro 风格的深色玻璃皮肤。
玻璃 UI（默认的浅色天空界面）完全不受影响。

## 怎么启用 / 关闭

启用（当前状态）：
- index.html 第 2 行：<html ... data-skin="visionos">
- index.html 第 22-23 行：<link rel="stylesheet" href="./css/08-visionos.css">

关闭：删掉上面两个东西即可，回到原始样式（其他文件不用动）。

## 作用范围

所有规则都限定在 html[data-skin="visionos"] body[data-ui-mode="cosmos"]，
只有切到星空 UI 时才生效。已验证：切回玻璃 UI 后背景、卡片圆角、颜色全部保持原样。

## 改了什么（相对 Gemini 原稿）

1. **作用域收窄**：原稿把所有规则挂在 html[data-skin] 上，会连带把玻璃 UI 也改暗。
   现在全部限定到 ody[data-ui-mode="cosmos"]。
2. **修选择器笔误**：原稿手机端有 . cosmos-nav-pills（点号后多了空格），
   这会让整条手机端规则失效；已修正。
3. **玻璃改深色**：原稿用白色半透明玻璃，在星空背景上对比度太低、文字发灰。
   visionOS 在深色背景上本来就是「深色玻璃 + 白字 + 亮光边」，已按此调整：
   - 面板底色 gba(16,24,46,.74) 一类的深色渐变
   - 白色顶部光边 + 底部微光 + 内圈细环
   - 阴影带蓝紫调（非纯黑）
4. **补齐讲义区可读性**（原稿完全没管学习页）：
   .lesson-copy、.option、.task-input、.passage、.transcript、
   .hint、.feedback、.kp-term、.kp-code、.ide-highlight、
   .progress-ring、.progress-bar 等逐个改成深色可读配色。
5. **FPS 监视器避让**：桌面移到右下角，避免和顶部导航胶囊重叠；手机端右下角小胶囊。
6. **手机端**（≤768px）：
   - 强制单列布局，修复子项撑破视口导致的横向溢出
   - 侧栏导航改为横向滚动，不再把「关于 / 许可」挤成竖排
   - 顶栏标题隐藏、按钮换行，不再压住页面标题
   - 触控区 ≥ 44px

## 硬约束（改动时务必保留）

- **禁止**对带 ackdrop-filter 的元素做 	ransform / translate 动画。
  Chromium 会反复重采样模糊层，导致卡片闪烁、短暂消失。只用
  ackground / box-shadow / border-color / opacity 做过渡。
- 不引入任何 CDN；字体只用系统栈。
- 保留 prefers-reduced-motion 支持。

## 已知取舍

- 星空 UI 里的星云、粒子、3D 轨道卡仍由 js/13-dual-ui.js 驱动，本次**没有改任何 JS**。
- 玻璃 UI 保持原样（浅色天空 + 液态玻璃），这是刻意的：两套 UI 本来就该有不同气质。
- FPS 监视器是浮动挂件，滚动时会浮在内容上，这是原有设计。
