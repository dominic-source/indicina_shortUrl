import { Injectable } from '@nestjs/common';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';


@Injectable()
export class ApiService {
  private longUrlToShortUrl = new Map<string, string>();
  private shortUrlToLongUrl = new Map<string, Map<string, string>>();
  private BASE62_CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private BASE62_LENGTH = this.BASE62_CHARACTERS.length;
  private LARGE_NUMBER = 1_000_000_000_000;
  private URL_PREFIX = 'http://short.est/';
  
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
    return this.prefixUrl(this.convertToBase62(randomNumber));
  }

  private prefixUrl(param: string): string {
    return `${this.URL_PREFIX}${param}`;
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
    urlMap.set('no_of_visits','0');
    urlMap.set('last_visited', 'never');
    this.longUrlToShortUrl.set(longUrl, shortUrl);
    this.shortUrlToLongUrl.set(shortUrl, urlMap);

    return { shortUrl };
  }

  decodeUrl(decodeDto: DecodeDto): string {
    const { shortUrl } = decodeDto;
    return this.shortUrlToLongUrl.get(shortUrl)?.get('longUrl') || 'URL not found';
  }

  getStatistics(urlPath: string): object {
    const shortUrl = this.prefixUrl(urlPath);
    if (this.shortUrlToLongUrl.has(shortUrl)) {
      const urlData = this.shortUrlToLongUrl.get(shortUrl);
      return {
        longUrl: urlData?.get('longUrl'),
        no_of_visits: urlData?.get('no_of_visits'),
        last_visited: urlData?.get('last_visited'),
        shortUrl: shortUrl,
      };

    }
    return { error: 'URL not found' };
  }

  listAllUrl(): { longUrl: string; shortUrl: string }[] {
    if (this.longUrlToShortUrl.size === 0) {
      return [{ longUrl: 'No URLs found', shortUrl: '' }];
    }
    
    const sortedUrls = Array.from(this.longUrlToShortUrl.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([longUrl, shortUrl]) => ({ longUrl, shortUrl }));
  
    return sortedUrls;
  }

  visitShortUrl(shortUrl: string): boolean {
    if (this.shortUrlToLongUrl.has(shortUrl)) {
      this.shortUrlToLongUrl.get(shortUrl)?.set('no_of_visits', (parseInt(this.shortUrlToLongUrl.get(shortUrl)?.get('no_of_visits') || '0') + 1).toString());
      this.shortUrlToLongUrl.get(shortUrl)?.set('last_visited', new Date().toISOString());
      return true;
    } else {
      return false;
    }
  }
}
