'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Layout, FileText, Image, Calendar, Briefcase, CreditCard, ArrowRight } from 'lucide-react';

const templateCategories = [
  { id: 'conference', name: '会刊', icon: FileText, count: 12 },
  { id: 'poster', name: '海报', icon: Image, count: 8 },
  { id: 'card', name: '名片', icon: CreditCard, count: 15 },
  { id: 'brochure', name: '宣传册', icon: Layout, count: 6 },
  { id: 'calendar', name: '日历', icon: Calendar, count: 4 },
  { id: 'business', name: '商务文档', icon: Briefcase, count: 10 },
];

const templates = [
  { id: 't1', name: '学术会刊', category: 'conference', preview: '📘', pages: 32, description: '适合学术会议论文集' },
  { id: 't2', name: '企业会刊', category: 'conference', preview: '📊', pages: 24, description: '适合企业年会纪念刊' },
  { id: 't3', name: '活动海报', category: 'poster', preview: '🎨', pages: 1, description: '活动宣传海报' },
  { id: 't4', name: '产品海报', category: 'poster', preview: '📱', pages: 1, description: '产品展示海报' },
  { id: 't5', name: '商务名片', category: 'card', preview: '💼', pages: 1, description: '简约商务风格' },
  { id: 't6', name: '创意名片', category: 'card', preview: '✨', pages: 1, description: '创意设计风格' },
  { id: 't7', name: '企业宣传册', category: 'brochure', preview: '📋', pages: 8, description: '企业形象展示' },
  { id: 't8', name: '产品手册', category: 'brochure', preview: '📖', pages: 12, description: '产品介绍手册' },
];

export default function TemplatesPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [selectedCategory, setSelectedCategory] = useState('conference');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = () => {
    if (!selectedTemplate) return;
    router.push('/editor/projects/' + projectId + '/documents/new?template=' + selectedTemplate);
  };

  const handleStartBlank = () => {
    router.push('/editor/projects/' + projectId + '/documents/new');
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            style={{
              background: 'white', borderRadius: '12px', padding: '16px',
              border: selectedTemplate === template.id ? '2px solid #5B6BE6' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '100%', aspectRatio: '3/4', background: '#F8FAFC', 
              borderRadius: '8px', marginBottom: '12px', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', fontSize: '48px' 
            }}>
              {template.preview}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2D3748', marginBottom: '4px' }}>{template.name}</h3>
            <p style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>{template.description}</p>
            <span style={{ fontSize: '11px', color: '#A0AEC0' }}>{template.pages} 页</span>
          </div>
        ))}
      </div>

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
          disabled={!selectedTemplate}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', background: selectedTemplate ? '#5B6BE6' : '#A0AEC0',
            border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 500, cursor: selectedTemplate ? 'pointer' : 'not-allowed'
          }}
        >
          使用此模板 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
