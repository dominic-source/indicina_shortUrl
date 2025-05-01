import { Injectable } from '@nestjs/common';
import { ApiService } from './api/api.service';

@Injectable()
export class AppService {
  constructor(private readonly apiService: ApiService) {}

  getRedirectUrl(urlPath: string): string | boolean {
    // Get the long URL from the short URL
    const shortUrl = this.apiService.prefixUrl(urlPath);
    const longUrl = this.apiService.decodeUrl({ shortUrl });
    if (longUrl === 'URL not found') {
      return false; // URL not found
    }
    this.apiService.visitShortUrl(shortUrl);
    return longUrl; // Redirect to the long URL
  }
}
