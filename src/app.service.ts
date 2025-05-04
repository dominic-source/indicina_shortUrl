import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ApiService } from './api/api.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => ApiService))
    private readonly apiService: ApiService,
    private readonly configService: ConfigService,
  ) {}

  get URL_PREFIX(): string | undefined {
    return this.configService.get('BASE_URL').endsWith('/')
      ? this.configService.get('BASE_URL')
      : this.configService.get('BASE_URL') + '/';
  }

  urlPostFix(param: string): string {
    return `${this.URL_PREFIX}${param}`;
  }

  getRedirectUrl(urlPath: string): string | boolean {
    // Get the long URL from the short URL
    const shortUrl = this.urlPostFix(urlPath);
    const longUrl = this.apiService.decodeUrl({ shortUrl });
    if (longUrl === 'URL not found') {
      return false;
    }
    this.apiService.visitShortUrl(shortUrl);
    return longUrl;
  }
}
