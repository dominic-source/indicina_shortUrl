import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';
import { AppService } from 'src/app.service';
import { UrlFetchDto } from './dto/urlFetch.dto';

interface IUrlRepository {
  hasLongUrl(longUrl: string): boolean;
  getShortUrl(longUrl: string): string | undefined;
  hasShortUrl(shortUrl: string): boolean;
  setMapping(longUrl: string, shortUrl: string, createdAt: string): void;
  getLongUrl(shortUrl: string): string | undefined;
  getUrlData(shortUrl: string): Map<string, string> | undefined;
  getAll(): [string, Map<string, string>][];
  updateVisit(shortUrl: string): void;
}

class InMemoryUrlRepository implements IUrlRepository {
  private longUrlToShortUrl = new Map<string, string>();
  private shortUrlToLongUrl = new Map<string, Map<string, string>>();

  hasLongUrl(longUrl: string): boolean {
    return this.longUrlToShortUrl.has(longUrl);
  }
  getShortUrl(longUrl: string): string | undefined {
    return this.longUrlToShortUrl.get(longUrl);
  }
  hasShortUrl(shortUrl: string): boolean {
    return this.shortUrlToLongUrl.has(shortUrl);
  }
  setMapping(longUrl: string, shortUrl: string, createdAt: string): void {
    let urlMap = new Map<string, string>();
    urlMap.set('longUrl', longUrl);
    urlMap.set('visits', '0');
    urlMap.set('lastVisited', 'never');
    urlMap.set('createdAt', createdAt);
    this.longUrlToShortUrl.set(longUrl, shortUrl);
    this.shortUrlToLongUrl.set(shortUrl, urlMap);
  }
  getLongUrl(shortUrl: string): string | undefined {
    return this.shortUrlToLongUrl.get(shortUrl)?.get('longUrl');
  }
  getUrlData(shortUrl: string): Map<string, string> | undefined {
    return this.shortUrlToLongUrl.get(shortUrl);
  }
  getAll(): [string, Map<string, string>][] {
    return Array.from(this.shortUrlToLongUrl.entries());
  }
  updateVisit(shortUrl: string): void {
    const urlData = this.shortUrlToLongUrl.get(shortUrl);
    if (urlData) {
      urlData.set(
        'visits',
        (parseInt(urlData.get('visits') || '0', 10) + 1).toString(),
      );
      urlData.set('lastVisited', new Date().toLocaleString());
    }
  }
}

@Injectable()
export class ApiService {
  private readonly urlRepository: IUrlRepository;
  private BASE62_CHARACTERS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private BASE62_LENGTH = this.BASE62_CHARACTERS.length;
  private LARGE_NUMBER = 1_000_000_000_000;

  constructor(
    @Inject(forwardRef(() => AppService))
    private appService: AppService,
  ) {
    // In production, inject repository via DI
    this.urlRepository = new InMemoryUrlRepository();
  }

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

    if (this.urlRepository.hasLongUrl(longUrl)) {
      return { shortUrl: this.urlRepository.getShortUrl(longUrl) || '' };
    }

    let shortUrl: string;
    do {
      shortUrl = this.generateShortUrl();
    } while (this.urlRepository.hasShortUrl(shortUrl));

    this.urlRepository.setMapping(
      longUrl,
      shortUrl,
      new Date().toLocaleString(),
    );

    return { shortUrl };
  }

  decodeUrl(decodeDto: DecodeDto): string {
    const { shortUrl } = decodeDto;
    return this.urlRepository.getLongUrl(shortUrl) || 'URL not found';
  }

  getStatistics(urlPath: string): UrlFetchDto {
    const shortUrl = this.appService.urlPostFix(urlPath);
    if (!this.urlRepository.hasShortUrl(shortUrl)) {
      return {
        longUrl: 'N/A',
        visits: undefined,
        lastVisited: undefined,
        createdAt: undefined,
        shortUrl: 'N/A',
      };
    }
    const urlData = this.urlRepository.getUrlData(shortUrl);

    return {
      longUrl: urlData?.get('longUrl') ?? 'N/A',
      visits: urlData?.get('visits'),
      lastVisited: urlData?.get('lastVisited'),
      createdAt: urlData?.get('createdAt'),
      shortUrl: shortUrl,
    };
  }

  listAllUrl(): UrlFetchDto[] | [] {
    const all = this.urlRepository.getAll();
    if (all.length === 0) {
      return [];
    }

    const sortedUrls = all
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
    this.urlRepository.updateVisit(shortUrl);
  }
}
