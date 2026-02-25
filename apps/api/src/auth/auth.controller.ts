import { Controller, Get, Post, Body, Query, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: { tenantId: string; email: string; password: string }) {
    return this.authService.validateUser(data.tenantId, data.email, data.password);
  }

  @Post('register')
  async register(@Body() data: { tenantId: string; email: string; password: string; name: string; role?: string }) {
    return this.authService.register(data.tenantId, data.email, data.password, data.name, data.role);
  }

  @Get('me')
  async me(@Body() user: any) {
    return this.authService.getUserById(user.id);
  }

  // WeChat OAuth endpoints (stub - requires proper implementation)
  @Get('wechat/qr')
  async getWechatQr(@Query('redirect') redirectUri: string) {
    // Generate WeChat OAuth QR URL
    const appId = process.env.WECHAT_APP_ID || 'wx1234567890';
    const state = Buffer.from(JSON.stringify({ redirect: redirectUri })).toString('base64');
    
    const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${encodeURIComponent(process.env.WECHAT_REDIRECT_URI || 'http://localhost:3001/auth/wechat/callback')}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
    
    return {
      qrUrl,
      appId,
    };
  }

  @Get('wechat/callback')
  async wechatCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: any) {
    // Redirect with error - WeChat integration requires proper backend
    console.log('WeChat callback received, code:', code);
    res.redirect('http://localhost:3000/login?error=wechat_not_configured');
  }

  @Post('wechat/bind')
  async bindWechat(@Body() data: { tenantId: string; email: string; password: string; wechatCode: string }) {
    // First verify user credentials
    const user = await this.authService.validateUser(data.tenantId, data.email, data.password);
    
    // Stub - WeChat binding requires proper implementation
    return { success: true, message: 'WeChat account binding not implemented' };
  }
}
