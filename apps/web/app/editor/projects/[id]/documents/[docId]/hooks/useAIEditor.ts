import { useState, useRef } from 'react';

// AI 生成类型
export type AIGenerateType = 'text' | 'image';

// AI 编辑器状态
export interface AIEditorState {
  // 基本 AI 状态
  aiType: AIGenerateType;
  setAiType: (type: AIGenerateType) => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  aiLoading: boolean;
  setAiLoading: (loading: boolean) => void;
  aiResults: any[];
  setAiResults: (results: any[]) => void;
  aiCount: number;
  setAiCount: (count: number) => void;
  
  // AI 区域模式
  aiAreaMode: boolean;
  setAiAreaMode: (mode: boolean) => void;
  aiAreaRef: React.MutableRefObject<any>;
  aiOverlayRef: React.MutableRefObject<any>;
  
  // AI 预览模式
  aiPreviewMode: boolean;
  setAiPreviewMode: (mode: boolean) => void;
  aiPreviewContent: { type: 'text' | 'image'; content: string } | null;
  setAiPreviewContent: (content: { type: 'text' | 'image'; content: string } | null) => void;
  aiPreviewRectRef: React.MutableRefObject<any>;
  
  // AI 选择模式
  aiSelectionMode: boolean;
  setAiSelectionMode: (mode: boolean) => void;
  aiSelectionModeRef: React.MutableRefObject<boolean>;
  aiSelectionStartRef: React.MutableRefObject<{ x: number; y: number } | null>;
  aiSelectionStart: { x: number; y: number } | null;
  setAiSelectionStart: (start: { x: number; y: number } | null) => void;
  aiSelectionRectRef: React.MutableRefObject<any>;
}

export function useAIEditor() {
  // 基本 AI 状态
  const [aiType, setAiType] = useState<AIGenerateType>('text');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiCount, setAiCount] = useState(3);
  
  // AI 区域模式
  const [aiAreaMode, setAiAreaMode] = useState(false);
  const aiAreaRef = useRef<any>(null);
  const aiOverlayRef = useRef<any>(null);
  
  // AI 预览模式
  const [aiPreviewMode, setAiPreviewMode] = useState(false);
  const [aiPreviewContent, setAiPreviewContent] = useState<{ type: 'text' | 'image'; content: string } | null>(null);
  const aiPreviewRectRef = useRef<any>(null);
  
  // AI 选择模式
  const [aiSelectionMode, setAiSelectionMode] = useState(false);
  const aiSelectionModeRef = useRef(aiSelectionMode);
  const aiSelectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const [aiSelectionStart, setAiSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const aiSelectionRectRef = useRef<any>(null);

  return {
    aiType,
    setAiType,
    aiPrompt,
    setAiPrompt,
    aiLoading,
    setAiLoading,
    aiResults,
    setAiResults,
    aiCount,
    setAiCount,
    aiAreaMode,
    setAiAreaMode,
    aiAreaRef,
    aiOverlayRef,
    aiPreviewMode,
    setAiPreviewMode,
    aiPreviewContent,
    setAiPreviewContent,
    aiPreviewRectRef,
    aiSelectionMode,
    setAiSelectionMode,
    aiSelectionModeRef,
    aiSelectionStartRef,
    aiSelectionStart,
    setAiSelectionStart,
    aiSelectionRectRef,
  };
}
