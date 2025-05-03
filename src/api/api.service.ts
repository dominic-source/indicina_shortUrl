import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';
import { AppService } from 'src/app.service';
import { UrlFetchDto } from './dto/urlFetch.dto';

@Injectable()
export class ApiService {
  constructor(
    @Inject(forwardRef(() => AppService))
    private appService: AppService,
  ) {}

  // Maps to store long and short URLs
  private longUrlToShortUrl = new Map<string, string>();
  private shortUrlToLongUrl = new Map<string, Map<string, string>>();
  private BASE62_CHARACTERS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private BASE62_LENGTH = this.BASE62_CHARACTERS.length;
  private LARGE_NUMBER = 1_000_000_000_000;

  private convertToBase62(num: number): string {
    let result = '';
    while (num > 0) {
      result = this.BASE62_CHARACTERS[num % this.BASE62_LENGTH] + result;
      num = Math.floor(num / this.BASE62_LENGTH);
    }
    return result;
  }

  private generateShortUrl(): string {
    const randomNumber = Math.floor(Math.random() * this.LARGE_NUMBER);
    return this.appService.urlPostFix(this.convertToBase62(randomNumber));
  }

  encodeUrl(encodeDto: EncodeDto): DecodeDto {
    const { longUrl } = encodeDto;

    // Check if the URL is already encoded
    if (this.longUrlToShortUrl.has(longUrl)) {
      return { shortUrl: this.longUrlToShortUrl.get(longUrl) || '' };
    }

    let shortUrl: string;

    // Generate a unique short URL
    do {
      shortUrl = this.generateShortUrl();
    } while (this.shortUrlToLongUrl.has(shortUrl));

    // Store the mappings
    let urlMap = new Map<string, string>();
    urlMap.set('longUrl', longUrl);
    urlMap.set('visits', '0');
    urlMap.set('lastVisited', 'never');
    urlMap.set('createdAt', new Date().toLocaleString());

    this.longUrlToShortUrl.set(longUrl, shortUrl);
    this.shortUrlToLongUrl.set(shortUrl, urlMap);

    return { shortUrl };
  }

  decodeUrl(decodeDto: DecodeDto): string {
    const { shortUrl } = decodeDto;
    return (
      this.shortUrlToLongUrl.get(shortUrl)?.get('longUrl') || 'URL not found'
    );
  }

  getStatistics(urlPath: string): UrlFetchDto {
    const shortUrl = this.appService.urlPostFix(urlPath);
    if (!this.shortUrlToLongUrl.has(shortUrl)) {
      return {
        longUrl: 'N/A',
        visits: undefined,
        lastVisited: undefined,
        createdAt: undefined,
        shortUrl: 'N/A',
      }
    }
      const urlData = this.shortUrlToLongUrl.get(shortUrl);

      return {
        longUrl: urlData?.get('longUrl') ?? 'N/A',
        visits: urlData?.get('visits'),
        lastVisited: urlData?.get('lastVisited'),
        createdAt: urlData?.get('createdAt'),
        shortUrl: shortUrl,
      };
  }

  listAllUrl(): UrlFetchDto[] | [] {
    if (this.longUrlToShortUrl.size === 0) {
      return [];
    }

    const sortedUrls = Array.from(this.shortUrlToLongUrl.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([shortUrl, urlData]) => ({
        shortUrl,
        longUrl: urlData.get('longUrl'),
        createdAt: urlData.get('createdAt') || 'N/A',
        visits: urlData.get('visits') || '0',
        lastVisited: urlData.get('lastVisited') || 'never',
      }));

    return sortedUrls;
  }

  visitShortUrl(shortUrl: string): void {
    if (this.shortUrlToLongUrl.has(shortUrl)) {
      const urlData = this.shortUrlToLongUrl.get(shortUrl);
      urlData?.set(
        'visits',
        (
          parseInt(urlData.get('visits') || '0', 10) + 1
        ).toString(),
      );
      urlData?.set('lastVisited', new Date().toLocaleString());
    }
  }
}
