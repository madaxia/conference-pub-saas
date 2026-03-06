import { Type, Square, Circle, Triangle, ImagePlus } from 'lucide-react';
import React from 'react';

export interface EditorElement {
  id: string;
  type: string;
  name: string;
  icon: React.ReactNode;
}

export const components: EditorElement[] = [
  { id: 'text', type: 'text', name: '文本', icon: <Type size={18} /> },
  { id: 'rect', type: 'rect', name: '矩形', icon: <Square size={18} /> },
  { id: 'circle', type: 'circle', name: '圆形', icon: <Circle size={18} /> },
  { id: 'triangle', type: 'triangle', name: '三角形', icon: <Triangle size={18} /> },
  { id: 'image', type: 'image', name: '图片', icon: <ImagePlus size={18} /> },
];
