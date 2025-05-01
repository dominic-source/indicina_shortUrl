import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiService } from './api/api.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly URL_404 = 'http://localhost:3000/404';

  @Get(':urlPath')
  @Redirect()
  redirectUrl(@Param('urlPath') urlPath: string) {
    const longUrl = this.appService.getRedirectUrl(urlPath);
    // if an error occurs, return a 404 page
    if (!longUrl) {
      return { url: this.URL_404 }; // Redirect to a 404 page
    }
    return { url: longUrl };
  }
}
