export { useCanvasState, useToolbarState, type CanvasState, type ToolbarState } from './useCanvasState';
export { useEditorHistory, type HistoryState } from './useEditorHistory';
export { useAIEditor, type AIEditorState, type AIGenerateType } from './useAIEditor';

// Re-export for convenience
export type { AIGenerateType as AIType } from './useAIEditor';
