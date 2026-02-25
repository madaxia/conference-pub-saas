import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { TemplatesModule } from './templates/templates.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AssetsModule } from './assets/assets.module';
import { ExportModule } from './export/export.module';
import { PrintOrdersModule } from './print/print-orders.module';
import { PrintersModule } from './printers/printers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserFontsModule } from './user-fonts/user-fonts.module';
import { SettingsModule } from './settings/settings.module';
import { SettingsController } from './settings/settings.controller';
import { EbookModule } from './ebooks/ebooks.module';
import { AIModule } from './ai/ai.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';
import { PaymentModule } from './payment/payment.module';
import { EmailModule } from './email/email.module';
import { EnterpriseModule } from './enterprise/enterprise.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    TenantsModule, 
    ProjectsModule, 
    DocumentsModule, 
    TemplatesModule,
    ReviewsModule,
    AssetsModule,
    ExportModule,
    PrintOrdersModule,
    PrintersModule,
    NotificationsModule,
    UserFontsModule,
    SettingsModule,
    EbookModule,
    AIModule,
    KnowledgeBaseModule,
    PaymentModule,
    EmailModule,
    EnterpriseModule,
    AdminModule,
  ],
  controllers: [SettingsController],
  providers: [],
})
export class AppModule {}
