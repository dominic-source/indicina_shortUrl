import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import { ApiService } from '../api/api.service';
import { BadRequestException } from '@nestjs/common';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';

describe('ApiController', () => {
  let controller: ApiController;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: ApiService,
          useValue: {
            encodeUrl: jest.fn(),
            decodeUrl: jest.fn(),
            getStatistics: jest.fn(),
            listAllUrl: jest.fn(),
            visitShortUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encodeUrl', () => {
    it('should encode a long URL successfully', () => {
      const encodeDto: EncodeDto = { longUrl: 'https://example.com/very/long/url' };
      const expectedResult = { shortUrl: 'http://short.url/abc123' };
      
      jest.spyOn(apiService, 'encodeUrl').mockReturnValue(expectedResult);
      
      const result = controller.encodeUrl(encodeDto);
      
      expect(result).toBe(expectedResult);
      expect(apiService.encodeUrl).toHaveBeenCalledWith(encodeDto);
    });
  });

  describe('decodeUrl', () => {
    it('should decode a short URL successfully', () => {
      const decodeDto: DecodeDto = { shortUrl: 'http://short.url/abc123' };
      const expectedLongUrl = {longUrl: 'https://example.com/very/long/url'};
      
      jest.spyOn(apiService, 'decodeUrl').mockReturnValue(expectedLongUrl);
      
      const result = controller.decodeUrl(decodeDto);
      
      expect(result).toBe(expectedLongUrl);
      expect(apiService.decodeUrl).toHaveBeenCalledWith(decodeDto);
    });

    it('should throw BadRequestException for non-existent URLs', () => {
      const decodeDto: DecodeDto = { shortUrl: 'http://short.url/notfound' };
      
      jest.spyOn(apiService, 'decodeUrl').mockReturnValue({longUrl: 'URL not found'});
      
      expect(() => controller.decodeUrl(decodeDto)).toThrow(BadRequestException);
      expect(apiService.decodeUrl).toHaveBeenCalledWith(decodeDto);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for a URL path', () => {
      const urlPath = 'abc123';
      const expectedStats = {
        longUrl: 'https://example.com/original',
        visits: '5',
        lastVisited: '1/1/2023, 12:00:00 PM',
        createdAt: '1/1/2023, 10:00:00 AM',
        shortUrl: 'http://short.url/abc123',
      };
      
      jest.spyOn(apiService, 'getStatistics').mockReturnValue(expectedStats);
      
      const result = controller.getStatistics(urlPath);
      
      expect(result).toBe(expectedStats);
      expect(apiService.getStatistics).toHaveBeenCalledWith(urlPath);
    });
  });

  describe('listAllUrl', () => {
    it('should return a list of all URLs', () => {
      const expectedList = [
        {
          shortUrl: 'http://short.url/abc123',
          longUrl: 'https://example.com/first',
          visits: '3',
          lastVisited: '1/1/2023, 12:00:00 PM',
          createdAt: '1/1/2023, 10:00:00 AM',
        },
        {
          shortUrl: 'http://short.url/def456',
          longUrl: 'https://example.com/second',
          visits: '1',
          lastVisited: '1/1/2023, 11:00:00 AM',
          createdAt: '1/1/2023, 10:30:00 AM',
        },
      ];
      
      jest.spyOn(apiService, 'listAllUrl').mockReturnValue(expectedList);
      
      const result = controller.listAllUrl();
      
      expect(result).toBe(expectedList);
      expect(apiService.listAllUrl).toHaveBeenCalled();
    });
  });
});
