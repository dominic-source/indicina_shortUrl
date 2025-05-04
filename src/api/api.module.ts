import { Module, forwardRef } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AppService } from '../app.service';

@Module({
  controllers: [ApiController],
  providers: [ApiService, AppService],
  exports: [ApiService],
})
export class ApiModule {}
