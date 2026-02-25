import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding test data...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'default-tenant' },
    update: {},
    create: { id: 'default-tenant', name: '默认租户' },
  })
  console.log('Created tenant')

  // Create test users
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@demo.com' } },
    update: { passwordHash: hashedPassword },
    create: {
      tenantId: tenant.id,
      email: 'admin@demo.com',
      name: '管理员',
      passwordHash: hashedPassword,
      role: 'superadmin',
      points: 1000,
    },
  })

  const user1 = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'user1@demo.com' } },
    update: { passwordHash: hashedPassword },
    create: {
      tenantId: tenant.id,
      email: 'user1@demo.com',
      name: '张三',
      passwordHash: hashedPassword,
      role: 'member',
      points: 500,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'user2@demo.com' } },
    update: { passwordHash: hashedPassword },
    create: {
      tenantId: tenant.id,
      email: 'user2@demo.com',
      name: '李四',
      passwordHash: hashedPassword,
      role: 'member',
      points: 300,
    },
  })

  console.log('Created users')

  // Create templates
  await prisma.template.upsert({
    where: { id: 'template-free' },
    update: {},
    create: {
      id: 'template-free',
      tenantId: tenant.id,
      name: '免费会议会刊模板',
      description: '基础版会议会刊模板',
      category: 'conference_program',
      isPublic: true,
      isPremium: false,
      points: 0,
    },
  })

  await prisma.template.upsert({
    where: { id: 'template-pro' },
    update: {},
    create: {
      id: 'template-pro',
      tenantId: tenant.id,
      name: '高级会议会刊模板',
      description: '专业设计的会议会刊模板',
      category: 'conference_program',
      isPublic: true,
      isPremium: true,
      points: 50,
    },
  })

  console.log('Created templates')

  // Create test project
  const project = await prisma.project.upsert({
    where: { id: 'test-project-1' },
    update: {},
    create: {
      id: 'test-project-1',
      tenantId: tenant.id,
      ownerId: user1.id,
      name: '2026年度技术大会会刊',
      conferenceName: '2026年度技术大会',
      issueDate: new Date('2026-03-15'),
      status: 'draft',
      projectType: 'personal',
    },
  })

  await prisma.document.upsert({
    where: { id: 'test-doc-1' },
    update: {},
    create: {
      id: 'test-doc-1',
      projectId: project.id,
      title: '会议议程',
      content: { sections: [{ title: '开幕', content: '欢迎...' }] },
      version: 1,
      status: 'draft',
    },
  })

  console.log('Created project')

  // Create test enterprise
  const enterprise = await prisma.enterprise.upsert({
    where: { id: 'test-enterprise-1' },
    update: {},
    create: {
      id: 'test-enterprise-1',
      name: '测试科技有限公司',
      contactName: '王总',
      contactPhone: '13800138000',
      contactEmail: 'wang@test.com',
      points: 10000,
      pointsDiscount: 0.85,
      status: 'active',
    },
  })

  await prisma.enterpriseMember.upsert({
    where: { enterpriseId_userId: { enterpriseId: enterprise.id, userId: user1.id } },
    update: {},
    create: {
      enterpriseId: enterprise.id,
      userId: user1.id,
      role: 'owner',
      status: 'active',
    },
  })

  console.log('Created enterprise')

  // Create KB items
  await prisma.knowledgeBaseItem.create({
    data: {
      title: '科技蓝配色方案',
      description: '适合技术会议的蓝色主题配色',
      type: 'image',
      tags: ['科技', '蓝色', '技术'],
      status: 'vectorized',
      uploadedBy: admin.id,
      content: '蓝色代表科技和专业',
    },
  })

  console.log('Created KB items')

  // Create settings
  const settings = [
    { key: 'ai_points_cost', value: '10' },
    { key: 'enterprise_default_discount', value: '0.9' },
    { key: 'project_undo_steps', value: '10' },
  ]
  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value },
    })
  }

  console.log('\n✅ Done!')
  console.log('\n📋 Login: admin@demo.com / password123')
  console.log('   Login: user1@demo.com / password123')
  console.log('   Login: user2@demo.com / password123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
