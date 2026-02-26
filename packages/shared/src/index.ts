// 会刊 SaaS - 共享类型定义

// ==================== 实体类型 ====================

export interface Tenant {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'member' | 'senior_member' | 'super_member' | 'printer_staff' | 'admin';

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  conferenceName: string;
  issueDate: Date;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 'draft' | 'editing' | 'reviewing' | 'finalizing' | 'printing' | 'completed';

export interface Template {
  id: string;
  tenantId?: string;
  name: string;
  description: string;
  category: TemplateCategory;
  config: TemplateConfig;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TemplateCategory = 'conference_program' | 'abstract_book' | 'sponsor_guide' | 'exhibition_manual' | 'custom';

export interface TemplateConfig {
  pageSize: string;
  margins: { top: number; right: number; bottom: number; left: number };
  columns: number;
  header?: string;
  footer?: string;
}

export interface Document {
  id: string;
  projectId: string;
  templateId?: string;
  title: string;
  content: DocumentContent;
  version: number;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentStatus = 'draft' | 'review' | 'frozen' | 'printing';

export interface DocumentContent {
  sections: Section[];
  metadata: Record<string, unknown>;
}

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  order: number;
  content: unknown;
}

export type SectionType = 'cover' | 'toc' | 'schedule' | 'abstract' | 'speaker' | 'sponsor' | 'advertisement' | 'custom';

export interface Revision {
  id: string;
  documentId: string;
  version: number;
  content: DocumentContent;
  thumbnail?: string;
  changeNote?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Asset {
  id: string;
  tenantId: string;
  projectId?: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface PrintOrder {
  id: string;
  projectId: string;
  printerId: string;
  specifications: PrintSpecifications;
  status: PrintOrderStatus;
  quote?: number;
  paidAt?: Date;
  shippedAt?: Date;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PrintOrderStatus = 'pending_quote' | 'quote_received' | 'confirmed' | 'printing' | 'shipped' | 'delivered' | 'cancelled';

export interface PrintSpecifications {
  quantity: number;
  paperType: string;
  binding: string;
  size: string;
  colorMode: 'bw' | 'color';
  pages: number;
}

export interface Review {
  id: string;
  documentId: string;
  revisionId: string;
  reviewerId: string;
  status: ReviewStatus;
  comments: ReviewComment[];
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewStatus = 'pending' | 'in_progress' | 'completed';

export interface ReviewComment {
  id: string;
  sectionId?: string;
  content: string;
  authorId: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type NotificationType = 'review_request' | 'review_completed' | 'order_status' | 'payment' | 'system';

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== DTO 类型 ====================

export interface CreateProjectDto {
  name: string;
  conferenceName: string;
  issueDate: Date;
}

export interface UpdateProjectDto {
  name?: string;
  conferenceName?: string;
  issueDate?: Date;
  status?: ProjectStatus;
}

export interface CreateDocumentDto {
  projectId: string;
  templateId?: string;
  title: string;
  content: DocumentContent;
}

export interface CreateRevisionDto {
  documentId: string;
  content: DocumentContent;
  changeNote?: string;
}

export interface CreateReviewDto {
  documentId: string;
  revisionId: string;
}

export interface AddReviewCommentDto {
  reviewId: string;
  sectionId?: string;
  content: string;
}

export interface CreatePrintOrderDto {
  projectId: string;
  printerId: string;
  specifications: PrintSpecifications;
}

export interface PresignedUploadDto {
  filename: string;
  mimeType: string;
}

// ==================== 枚举 ====================

export const UserRolePriority: Record<UserRole, number> = {
  member: 1,
  senior_member: 2,
  super_member: 3,
  printer_staff: 4,
  admin: 5,
};

export const ProjectStatusOrder: ProjectStatus[] = [
  'draft',
  'editing',
  'reviewing',
  'finalizing',
  'printing',
  'completed',
];

// ==================== CMYK 转换 ====================

/**
 * 将 RGB 转换为 CMYK
 * 用于印刷厂打印
 */
export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 1 };
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);
  return { c: Math.round(c * 100) / 100, m: Math.round(m * 100) / 100, y: Math.round(y * 100) / 100, k: Math.round(k * 100) / 100 };
}

/**
 * 将十六进制颜色转换为 CMYK
 */
export function hexToCmyk(hex: string): { c: number; m: number; y: number; k: number } {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return rgbToCmyk(r, g, b);
}
