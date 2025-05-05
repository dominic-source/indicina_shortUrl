import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from './api.service';
import { AppService } from '../app.service';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';

describe('ApiService', () => {
  let apiService: ApiService;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: AppService,
          useValue: {
            urlPostFix: jest.fn((path) => `http://short.url/${path}`),
          },
        },
      ],
    }).compile();

    apiService = module.get<ApiService>(ApiService);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  describe('encodeUrl', () => {
    it('should create a short URL for a new long URL', () => {
      const longUrl = 'https://example.com/very/long/url/path';
      const encodeDto: EncodeDto = { longUrl };

      const result = apiService.encodeUrl(encodeDto);
      
      expect(result).toBeDefined();
      expect(result.shortUrl).toBeDefined();
      expect(result.shortUrl.length).toBeLessThan(longUrl.length);
      expect(appService.urlPostFix).toHaveBeenCalled();
    });

    it('should return the same short URL for an existing long URL', () => {
      const longUrl = 'https://example.com/already/exists';
      const encodeDto: EncodeDto = { longUrl };
      
      // First call to create initial mapping
      const firstResult = apiService.encodeUrl(encodeDto);
      // Second call should return the same short URL
      const secondResult = apiService.encodeUrl(encodeDto);
      
      expect(secondResult.shortUrl).toBe(firstResult.shortUrl);
    });

    it('should handle different long URLs with different short URLs', () => {
      const firstLongUrl = 'https://example.com/first';
      const secondLongUrl = 'https://example.com/second';
      
      const firstResult = apiService.encodeUrl({ longUrl: firstLongUrl });
      const secondResult = apiService.encodeUrl({ longUrl: secondLongUrl });
      
      expect(firstResult.shortUrl).not.toBe(secondResult.shortUrl);
    });
  });

  describe('decodeUrl', () => {
    it('should return the original long URL for a valid short URL', () => {
      const longUrl = 'https://example.com/original/url';
      const encodeDto: EncodeDto = { longUrl };
      
      // Create a mapping first
      const { shortUrl } = apiService.encodeUrl(encodeDto);
      
      // Then decode
      const result = apiService.decodeUrl({ shortUrl });
      
      expect(result.longUrl).toBe(longUrl);
    });

    it('should return "URL not found" for a non-existent short URL', () => {
      const nonExistentUrl = 'http://short.url/nonexistent';
      const decodeDto: DecodeDto = { shortUrl: nonExistentUrl };
      
      const result = apiService.decodeUrl(decodeDto);
      
      expect(result.longUrl).toBe('URL not found');
    });
  });

  describe('visitShortUrl', () => {
    it('should update visit count when a short URL is visited', () => {
      const longUrl = 'https://example.com/tracking/test';
      const { shortUrl } = apiService.encodeUrl({ longUrl });
      
      // Get initial stats
      const initialStats = apiService.getStatistics(shortUrl.split('/').pop() || '');
      const initialVisits = parseInt(initialStats.visits || '0', 10);
      
      // Visit the URL
      apiService.visitShortUrl(shortUrl);
      
      // Get updated stats
      const updatedStats = apiService.getStatistics(shortUrl.split('/').pop() || '');
      const updatedVisits = parseInt(updatedStats.visits || '0', 10);
      
      expect(updatedVisits).toBe(initialVisits + 1);
      expect(updatedStats.lastVisited).not.toBe('never');
    });
  });
});
