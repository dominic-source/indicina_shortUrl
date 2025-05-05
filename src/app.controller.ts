import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly URL_404: string;
  constructor(private readonly appService: AppService) {
    this.URL_404 = `${this.appService.URL_PREFIX}404`;
  }

  @Get()
  hello(): string {
    return 'Hello World!';
  }
  
  @Get(':urlPath')
  @Redirect()
  redirectUrl(@Param('urlPath') urlPath: string) {
    const longUrl = this.appService.getRedirectUrl(urlPath);
    if (!longUrl) {
      return { url: this.URL_404 };
    }
    return { url: longUrl };
  }
}
