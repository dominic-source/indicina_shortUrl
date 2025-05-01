import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':urlPath')
  redirectUrl(@Param('urlPath') urlPath: string): string {
    return this.appService.redirectUrl();
  }
}
