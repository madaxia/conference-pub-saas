import { useState, useRef, useEffect } from 'react';

// 画布相关状态
export interface CanvasState {
  zoom: number;
  setZoom: (zoom: number) => void;
  pageSize: string;
  setPageSize: (size: string) => void;
  selectedObject: any;
  setSelectedObject: (obj: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export function useCanvasState() {
  const [zoom, setZoom] = useState(100);
  const [pageSize, setPageSize] = useState('A4');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  return {
    zoom,
    setZoom,
    pageSize,
    setPageSize,
    selectedObject,
    setSelectedObject,
    loading,
    setLoading,
  };
}

// 工具状态
export interface ToolbarState {
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  gridDensity: number;
  setGridDensity: (density: number) => void;
  gridColor: string;
  setGridColor: (color: string) => void;
  activeTool: 'move' | 'hand';
  setActiveTool: (tool: 'move' | 'hand') => void;
  activeToolRef: React.MutableRefObject<'move' | 'hand'>;
}

export function useToolbarState() {
  const [showGrid, setShowGrid] = useState(false);
  const [gridDensity, setGridDensity] = useState(20);
  const [gridColor, setGridColor] = useState('#CBD5E1');
  const [activeTool, setActiveTool] = useState<'move' | 'hand'>('move');
  const activeToolRef = useRef(activeTool);

  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  return {
    showGrid,
    setShowGrid,
    gridDensity,
    setGridDensity,
    gridColor,
    setGridColor,
    activeTool,
    setActiveTool,
    activeToolRef,
  };
}
