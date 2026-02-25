// Export utilities for admin panels

// Convert data to CSV
export function exportToCSV(data: any[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data || data.length === 0) {
    alert('没有数据可导出');
    return;
  }

  // Get columns from first row if not provided
  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0]);
  const labels = columns ? columns.map(c => c.label) : keys;

  // Create CSV content
  const csvRows = [
    labels.join(','), // Header row
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        // Handle values with commas or quotes
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

// Simple Excel-like XML format (more compatible)
export function exportToExcel(data: any[], filename: string, columns?: { key: string; label: string }[]) {
  if (!data || data.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0]);
  const labels = columns ? columns.map(c => c.label) : keys;

  // Create XML-based Excel file
  let xml = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>';
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
  xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';
  xml += '<Worksheet ss:Name="Sheet1"><Table>';

  // Header row
  xml += '<Row>';
  for (const label of labels) {
    xml += `<Cell><Data ss:Type="String">${escapeXml(label)}</Data></Cell>`;
  }
  xml += '</Row>';

  // Data rows
  for (const row of data) {
    xml += '<Row>';
    for (const key of keys) {
      const value = row[key];
      if (value === null || value === undefined) {
        xml += '<Cell><Data ss:Type="String"></Data></Cell>';
      } else if (typeof value === 'number') {
        xml += `<Cell><Data ss:Type="Number">${value}</Data></Cell>`;
      } else {
        xml += `<Cell><Data ss:Type="String">${escapeXml(String(value))}</Data></Cell>`;
      }
    }
    xml += '</Row>';
  }

  xml += '</Table></Worksheet></Workbook>';

  downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Column definitions for common tables
export const UserColumns = [
  { key: 'id', label: 'ID' },
  { key: 'email', label: '邮箱' },
  { key: 'name', label: '姓名' },
  { key: 'role', label: '角色' },
  { key: 'points', label: '积分' },
  { key: 'createdAt', label: '创建时间' },
];

export const ProjectColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '项目名称' },
  { key: 'conferenceName', label: '会议名称' },
  { key: 'status', label: '状态' },
  { key: 'createdAt', label: '创建时间' },
];

export const OrderColumns = [
  { key: 'id', label: 'ID' },
  { key: 'projectName', label: '项目名称' },
  { key: 'category', label: '印刷品类' },
  { key: 'paperType', label: '纸张类型' },
  { key: 'quantity', label: '数量' },
  { key: 'estimatedPrice', label: '预估价格' },
  { key: 'status', label: '状态' },
  { key: 'createdAt', label: '创建时间' },
];

export const EbookColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: '标题' },
  { key: 'projectId', label: '项目ID' },
  { key: 'pointsSpent', label: '消耗积分' },
  { key: 'endDate', label: '过期时间' },
  { key: 'isActive', label: '状态' },
  { key: 'createdAt', label: '创建时间' },
];

export const NotificationColumns = [
  { key: 'id', label: 'ID' },
  { key: 'type', label: '类型' },
  { key: 'title', label: '标题' },
  { key: 'isRead', label: '已读' },
  { key: 'createdAt', label: '发送时间' },
];
