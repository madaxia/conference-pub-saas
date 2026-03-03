'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function ImportPDFPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [pages, setPages] = useState<number>(0);
  const [error, setError] = useState('');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('请上传 PDF 文件');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('请上传 PDF 文件');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setPages(5);
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 2000);
    setUploading(false);
  };

  const handleGoToEditor = () => {
    router.push('/editor/projects/' + projectId + '/documents');
  };

  return (
    <div style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
      <button onClick={() => router.push('/projects/' + projectId)} style={{ color: '#718096', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}>
        <ArrowLeft size={18} /> 返回项目
      </button>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>导入 PDF</h1>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>上传 PDF 文件，系统将自动分析并分页</p>

      {!pages && (
        <div onClick={() => document.getElementById('file-input')?.click()} style={{ background: 'white', borderRadius: '16px', padding: '48px', border: file ? '2px solid #5B6BE6' : '2px dashed #E2E8F0', textAlign: 'center', marginBottom: '24px', cursor: 'pointer' }}>
          <input id="file-input" type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
          {file ? (
            <div>
              <FileText size={48} style={{ color: '#5B6BE6', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748' }}>{file.name}</p>
              <p style={{ fontSize: '13px', color: '#718096' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <Upload size={48} style={{ color: '#A0AEC0', marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#2D3748' }}>拖拽 PDF 文件到此处</p>
              <p style={{ fontSize: '13px', color: '#718096' }}>或点击选择文件</p>
            </div>
          )}
        </div>
      )}

      {pages > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          {analyzing ? (
            <div>
              <Loader2 size={48} style={{ color: '#5B6BE6', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#2D3748' }}>正在分析文档...</p>
            </div>
          ) : (
            <div>
              <Check size={48} style={{ color: '#059669', marginBottom: '16px' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: '#2D3748' }}>分析完成！</p>
              <p style={{ fontSize: '14px', color: '#718096' }}>共识别 {pages} 页，每页可单独编辑</p>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {pages > 0 && !analyzing ? (
          <button onClick={handleGoToEditor} style={{ padding: '12px 24px', background: '#5B6BE6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>进入编辑器</button>
        ) : (
          <button onClick={handleUpload} disabled={!file || uploading} style={{ padding: '12px 24px', background: file ? '#5B6BE6' : '#A0AEC0', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: file ? 'pointer' : 'not-allowed' }}>{uploading ? '上传中...' : '开始上传'}</button>
        )}
      </div>
    </div>
  );
}
