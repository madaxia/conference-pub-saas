import React from 'react';

// 工具栏按钮样式
export const toolbarButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  background: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: '#718096',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

// 标签样式
export const LabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#718096',
  marginBottom: '8px',
};

// 输入框样式
export const InputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  background: '#F5F7FB',
  border: '1px solid #E2E8F0',
  borderRadius: '6px',
  fontSize: '13px',
  color: '#2D3748',
  outline: 'none',
};

// 输入框标签样式
export const InputLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: '#A0AEC0',
  marginBottom: '4px',
};
