import { useState } from 'react';

// 历史记录状态
export interface HistoryState {
  history: any[];
  setHistory: (history: any[]) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
}

export function useEditorHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  return {
    history,
    setHistory,
    historyIndex,
    setHistoryIndex,
  };
}
