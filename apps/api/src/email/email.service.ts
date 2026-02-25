import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class EmailService {
  private transporter: any;
  
  constructor(private settingsService: SettingsService) {
    this.initTransporter();
  }

  private async initTransporter() {
    const nodemailer = require('nodemailer');
    
    const host = await this.settingsService.get('email_host') || 'smtp.qq.com';
    const port = await this.settingsService.getNumber('email_port', 465);
    const user = await this.settingsService.get('email_user') || '';
    const pass = await this.settingsService.get('email_password') || '';
    const from = await this.settingsService.get('email_from') || 'noreply@example.com';

    if (!user || !pass) {
      console.log('Email not configured - skipping transporter initialization');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.transporter) {
      console.log('Email not configured, skipping send');
      return { success: false, reason: 'email_not_configured' };
    }

    try {
      const from = await this.settingsService.get('email_from') || 'noreply@example.com';
      
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Template emails
  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail(
      email,
      '欢迎使用 ConferencePub 会刊出版平台',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #A259FF;">欢迎 ${name}!</h1>
        <p>感谢您注册 ConferencePub 会议会刊出版平台。</p>
        <p>您可以开始：</p>
        <ul>
          <li>创建会刊项目</li>
          <li>邀请团队成员协作</li>
          <li>设计专业的会议会刊</li>
          <li>一键下单印刷</li>
        </ul>
        <p>祝您使用愉快！</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #888; font-size: 12px;">ConferencePub 团队</p>
      </div>
      `
    );
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    return this.sendEmail(
      email,
      '重置您的密码',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #A259FF;">重置密码</h1>
        <p>您请求重置密码，请点击以下链接：</p>
        <p><a href="${resetUrl}" style="background: #A259FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">重置密码</a></p>
        <p>如果这不是您的操作，请忽略此邮件。</p>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">链接有效期：24小时</p>
      </div>
      `
    );
  }

  async sendOrderNotification(email: string, orderInfo: any) {
    return this.sendEmail(
      email,
      `订单状态更新: ${orderInfo.status}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #A259FF;">订单更新</h1>
        <p>您的印刷订单状态已更新：</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>订单号:</strong> ${orderInfo.orderId}</p>
          <p><strong>状态:</strong> ${orderInfo.status}</p>
          <p><strong>项目:</strong> ${orderInfo.projectName}</p>
        </div>
        <p>如有问题，请联系客服。</p>
      </div>
      `
    );
  }

  async sendReviewNotification(email: string, documentName: string, status: string) {
    return this.sendEmail(
      email,
      `文档审稿状态: ${status}`,
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #A259FF;">审稿通知</h1>
        <p>您的文档 "<strong>${documentName}</strong>" 审稿状态已更新为: <strong>${status}</strong></p>
        <p>请登录平台查看详情。</p>
      </div>
      `
    );
  }
}
