'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Layout, FileText, Image, Calendar, Briefcase, CreditCard, ArrowRight, Loader2 } from 'lucide-react';

const templateCategories = [
  { id: 'conference', name: '会刊', icon: FileText, count: 12 },
  { id: 'poster', name: '海报', icon: Image, count: 8 },
  { id: 'card', name: '名片', icon: CreditCard, count: 15 },
  { id: 'brochure', name: '宣传册', icon: Layout, count: 6 },
  { id: 'calendar', name: '日历', icon: Calendar, count: 4 },
  { id: 'business', name: '商务文档', icon: Briefcase, count: 10 },
];

// Local fallback templates
const fallbackTemplates = [
  { id: 't1', name: '学术会刊', category: 'conference', preview: '📘', pages: 32, description: '适合学术会议论文集', thumbnailUrl: null },
  { id: 't2', name: '企业会刊', category: 'conference', preview: '📊', pages: 24, description: '适合企业年会纪念刊', thumbnailUrl: null },
  { id: 't3', name: '活动海报', category: 'poster', preview: '🎨', pages: 1, description: '活动宣传海报', thumbnailUrl: null },
  { id: 't4', name: '产品海报', category: 'poster', preview: '📱', pages: 1, description: '产品展示海报', thumbnailUrl: null },
  { id: 't5', name: '商务名片', category: 'card', preview: '💼', pages: 1, description: '简约商务风格', thumbnailUrl: null },
  { id: 't6', name: '创意名片', category: 'card', preview: '✨', pages: 1, description: '创意设计风格', thumbnailUrl: null },
  { id: 't7', name: '企业宣传册', category: 'brochure', preview: '📋', pages: 8, description: '企业形象展示', thumbnailUrl: null },
  { id: 't8', name: '产品手册', category: 'brochure', preview: '📖', pages: 12, description: '产品介绍手册', thumbnailUrl: null },
];

interface Template {
  id: string;
  name: string;
  category: string;
  description?: string;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  config?: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [selectedCategory, setSelectedCategory] = useState('conference');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('http://localhost:3001/templates');
        if (res.ok) {
          const data = await res.json();
          // Map API templates to local format
          const mappedTemplates = data.map((t: any) => ({
            id: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            thumbnailUrl: t.thumbnailUrl || t.thumbnailUrl,
            previewUrl: t.previewUrl,
            config: t.config,
          }));
          setTemplates(mappedTemplates);
        } else {
          setTemplates(fallbackTemplates);
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        setTemplates(fallbackTemplates);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => t.category === selectedCategory);

  // Handle template selection and document creation
  const handleSelectTemplate = async () => {
    if (!selectedTemplate) return;
    
    setCreating(true);
    try {
      // Create document with templateId
      const res = await fetch('http://localhost:3001/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // In real app, get token from auth context
          'Authorization': 'Bearer ' + (typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''),
        },
        body: JSON.stringify({
          projectId,
          title: selectedTemplate.name,
          templateId: selectedTemplate.id,
        }),
      });

      if (res.ok) {
        const doc = await res.json();
        // Navigate to editor with template data
        router.push(`/editor/projects/${projectId}/documents/${doc.id}?template=${selectedTemplate.id}`);
      } else {
        // Fallback: navigate without creating (for demo)
        router.push(`/editor/projects/${projectId}/documents/new?template=${selectedTemplate.id}`);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
      // Fallback: navigate without creating
      router.push(`/editor/projects/${projectId}/documents/new?template=${selectedTemplate.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleStartBlank = () => {
    router.push(`/editor/projects/${projectId}/documents/new`);
  };

  return (
    <div className="templates-page" style={{ padding: '24px', background: '#F5F7FB', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => router.push('/projects/' + projectId)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#718096', background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
        >
          <ArrowLeft size={18} /> 返回项目
        </button>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#2D3748', marginBottom: '6px' }}>选择模板</h1>
        <p style={{ color: '#718096', fontSize: '14px' }}>选择一个模板开始，或从空白页面创建</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {templateCategories.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', background: isActive ? '#5B6BE6' : 'white',
                border: isActive ? 'none' : '1px solid #E2E8F0',
                borderRadius: '10px', cursor: 'pointer',
                color: isActive ? 'white' : '#4A5568', fontSize: '14px', fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} /> {cat.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: '#5B6BE6' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              style={{
                background: 'white', borderRadius: '12px', padding: '16px',
                border: selectedTemplate?.id === template.id ? '2px solid #5B6BE6' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                width: '100%', aspectRatio: '3/4', background: '#F8FAFC', 
                borderRadius: '8px', marginBottom: '12px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', fontSize: '48px' 
              }}>
                {template.thumbnailUrl ? (
                  <img src={template.thumbnailUrl} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  '📄'
                )}
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D3748', marginBottom: '4px' }}>{template.name}</h3>
              <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>{template.description || '无描述'}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={handleStartBlank}
          style={{
            padding: '12px 24px', background: 'white', border: '1px solid #E2E8F0',
            borderRadius: '8px', color: '#4A5568', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
          }}
        >
          从空白页开始
        </button>
        <button
          onClick={handleSelectTemplate}
          disabled={!selectedTemplate || creating}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: selectedTemplate && !creating ? '#5B6BE6' : '#A0AEC0',
            border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: selectedTemplate && !creating ? 'pointer' : 'not-allowed'
          }}
        >
          {creating ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          {creating ? '创建中...' : '使用此模板'}
        </button>
      </div>
    </div>
  );
}
