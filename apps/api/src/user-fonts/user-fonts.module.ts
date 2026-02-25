import { Module } from '@nestjs/common';
import { UserFontsService } from './user-fonts.service';
import { UserFontsController } from './user-fonts.controller';

@Module({
  controllers: [UserFontsController],
  providers: [UserFontsService],
  exports: [UserFontsService],
})
export class UserFontsModule {}
