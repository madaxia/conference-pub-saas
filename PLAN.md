# 会议会刊 SaaS 系统 - 迭代开发计划

## 目标

优化编辑器代码质量，拆分大型组件，提升可维护性。

## 当前状态

- 编辑器页面 `page.tsx` 长达 2088 行
- 存在大量代码质量问题（Clean Code Review 已识别）

## 非目标

- 不添加新功能
- 不改变现有 API 接口
- 不修改数据库结构

## 阶段计划

### Phase 1: 提取常量与配置

- 提取 `pageSizes` 为常量文件 `constants/pageSizes.ts`
- 提取 `fonts` 数组到 `constants/fonts.ts`
- 提取魔法数字为命名常量
- 提取内联样式到 `styles/editor.ts`

### Phase 2: 拆分 useState 状态

- 将 AI 相关状态提取为 `hooks/useAIEditor.ts`
- 将画布相关状态提取为 `hooks/useCanvasState.ts`
- 将历史记录状态提取为 `hooks/useEditorHistory.ts`
- 将工具栏状态提取为 `hooks/useToolbarState.ts`

### Phase 3: 拆分 Fabric.js 初始化逻辑

- 提取 `initCanvas` 为 `hooks/useFabricCanvas.ts`
- 提取网格初始化到 `utils/grid.ts`
- 提取 artboard 创建到 `utils/artboard.ts`
- 拆分事件监听为独立函数

### Phase 4: 拆分事件处理函数

- 提取缩放事件处理到 `handlers/handleObjectScaling.ts`
- 提取对齐网格到 `utils/snapToGrid.ts`
- 提取 AI 相关事件处理到 `handlers/aiEventHandlers.ts`

### Phase 5: 拆分 UI 组件

- 提取工具栏为 `components/EditorToolbar.tsx`
- 提取左侧面板为 `components/LeftPanel.tsx`
- 提取右侧属性面板为 `components/PropertyPanel.tsx`
- 提取 AI 面板为 `components/AIPanel.tsx`

### Phase 6: 移除未使用代码

- 删除 `loadFont` 函数
- 删除未使用的面板状态
- 清理注释和死代码

## 验收标准

1. 拆分后 `page.tsx` 行数 < 500 行
2. 每个 Hook 文件 < 200 行
3. `npm run build` 构建成功
4. 编辑器功能正常运行（添加文字/图形/图片）
5. AI 生成功能正常
6. 撤销/重做功能正常
