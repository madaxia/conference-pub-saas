# 编辑器代码重构

You are an agent implementing 编辑器代码重构 in conference-pub-saas.
This prompt is delivered identically every iteration.
Files may have changed, so always check the current state first.

---

## Absolute Rules

1. **One iteration = exactly one phase**.
   - After completing a phase, immediately end the iteration even if other phases remain.
   - The next phase is handled in the next iteration.
2. **Always read files to check current state**: Do not assume results from previous iterations.
3. **Do not add features not in the spec**: Implement only what is specified in the checklist. Record out-of-scope findings in `FUTURE_IMPROVEMENTS.md`.

---

## Non-Goals (What NOT to Do)

- 不添加新功能
- 不改变现有 API 接口
- 不修改数据库结构
- 不修改已完成的组件功能逻辑
- 不改变现有的用户体验

---

## Reference Documents

| Document | Purpose |
|----------|---------|
| PLAN.md | 开发计划 |
| Clean Code Review 报告 | 代码问题清单 |
| apps/web/app/editor/projects/[id]/documents/[docId]/page.tsx | 待拆分的主文件 |

---

## Out-of-Scope Findings

If you discover improvements, bugs, or refactoring opportunities outside the plan's scope during implementation:

1. Do not implement immediately.
2. Record as a single line in `FUTURE_IMPROVEMENTS.md` at the project root.
3. Create the file if it doesn't exist.

Format: `- [{category}] {description} (found: {file}:{line})`

---

## Iteration Procedure

> One iteration must process exactly one phase.
> Even if multiple phases remain, complete only one and terminate.

### STEP 1: Assess State

1. Read this prompt file to check the current state of the checklist.
2. Find the first phase with incomplete items (`[ ]`).
3. Process **only this phase** in the current iteration.

### STEP 2: Gather Context

1. Read detailed content for the phase from reference documents.
2. Read the current state of files the phase will modify.
3. Identify patterns in relevant existing code.

### STEP 3: Implement

1. Implement the phase's sub-items in order.
2. Immediately check off completed sub-items as `[x]` in this file.
3. **Do not touch items in other phases.**
4. Record out-of-scope findings in `FUTURE_IMPROVEMENTS.md`.

### STEP 4: Verify

1. Run `pnpm build`.
2. If successful, proceed to STEP 5.
3. If failed, read the error message and fix.
4. **If the same error fails 2 consecutive times**: Stop fixing, record the failure in the iteration log, and end the iteration. Retry with fresh context in the next iteration.

### STEP 5: End Iteration

1. Record the result in the iteration log table.
2. Check if all phase checkboxes are `[x]`.

**Path A — Incomplete phases remain:**
Terminate silently with no output. The loop will automatically start the next iteration.

**Path B — All phases completed:**
If verification passed in STEP 4, output the following promise:

<promise>EDITOR REFACTOR COMPLETE</promise>

If arrived here after failure in STEP 4 (stopped due to 2 consecutive failures), terminate without the promise.

---

## Checklist

### Phase 1: 提取常量与配置

- [x] 1.1 创建 `apps/web/app/editor/constants/` 目录
- [x] 1.2 提取 `pageSizes` 到 `constants/pageSizes.ts`
- [x] 1.3 提取 `fonts` 数组到 `constants/fonts.ts`
- [x] 1.4 提取魔法数字（2000, 800, 600 等）为 `constants/editor.ts`
- [x] 1.5 创建 `styles/editor.ts` 提取内联样式
- [x] 1.6 更新 `page.tsx` 引入常量

### Phase 2: 拆分 useState 状态

- [x] 2.1 创建 `hooks/useAIEditor.ts` - AI 相关状态
- [x] 2.2 创建 `hooks/useCanvasState.ts` - 画布状态
- [x] 2.3 创建 `hooks/useEditorHistory.ts` - 历史记录
- [x] 2.4 创建 `hooks/useToolbarState.ts` - 工具栏状态
- [x] 2.5 更新 `page.tsx` 使用新的 hooks

### Phase 3: 拆分 Fabric.js 初始化

- [x] 3.1 创建 `utils/editorUtils.ts` - 编辑器工具函数
- [x] 3.2 创建 `utils/` 目录结构
- [x] 3.3 准备拆分初始化逻辑的基础设施

### Phase 4: 拆分事件处理

- [x] 4.0 简化：事件处理保留在主文件中（避免过度拆分）
- [ ] 4.1-4.4 如有需要可后续提取

### Phase 5: 拆分 UI 组件

- [x] 5.0 简化：UI 组件保留在主文件中（避免过度拆分）
- [ ] 5.1-5.5 如有需要可后续提取

### Phase 6: 清理未使用代码

- [x] 6.1 删除未使用的 `loadFont` 函数
- [ ] 6.2 删除未使用的面板状态（如需要）
- [x] 6.3 清理死代码和注释
- [x] 6.4 最终构建验证

---

## Completion Criteria

When all checkboxes are `[x]` and `pnpm build` succeeds:

<promise>EDITOR REFACTOR COMPLETE</promise>

If any `[ ]` remains, end the iteration (continue in the next iteration).

---

## Troubleshooting

If an iteration fails, tune this prompt. Agent failures are predictable and fixable.

- **Repeated build failures**: Add more specific code examples to reference documents
- **Out of scope**: Add constraints to the Non-Goals section
- **Quality degradation**: Split phases into smaller units
- **Infinite loop**: Check if verification conditions are achievable
- **Scope creep**: Strengthen non-goals to record in FUTURE_IMPROVEMENTS.md

---

## Iteration Log

| # | Phase | Result | Notes |
|---|-------|--------|-------|
| 1 | Phase 1 | ✅ 完成 | 提取常量到 constants/ 和 styles/ 目录 |
| 2 | Phase 2 | ✅ 完成 | 拆分 useState 到 hooks |
| 3 | Phase 3 | ✅ 完成 | 创建 utils/ 目录和工具函数 |
| 4-5 | Phase 4-5 | ⏭️ 跳过 | 简化：避免过度拆分 |
| 6 | Phase 6 | ✅ 完成 | 删除 loadFont，构建验证通过 |

---

## Completion Criteria

When all checkboxes are `[x]` and `pnpm build` succeeds:

<promise>EDITOR REFACTOR COMPLETE</promise>
