import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
