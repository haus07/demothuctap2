import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports:[UserModule]
})
export class AdminModule {}
