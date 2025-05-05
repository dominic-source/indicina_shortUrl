import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getRedirectUrl: jest.fn(),
            URL_PREFIX: 'http://localhost:3000/',
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('redirectUrl', () => {
    it('should redirect to the long URL if found', () => {
      const urlPath = 'test';
      const longUrl = 'https://www.google.com';
      (appService.getRedirectUrl as jest.Mock).mockReturnValue(longUrl);

      const result = appController.redirectUrl(urlPath);

      expect(appService.getRedirectUrl).toHaveBeenCalledWith(urlPath);
      expect(result).toEqual({ url: longUrl });
    });

    it('should redirect to the 404 page if long URL is not found', () => {
      const urlPath = 'nonexistent';
      (appService.getRedirectUrl as jest.Mock).mockReturnValue(null);
      const URL_404 = `${appService.URL_PREFIX}404`;

      const result = appController.redirectUrl(urlPath);

      expect(appService.getRedirectUrl).toHaveBeenCalledWith(urlPath);
      expect(result).toEqual({ url: URL_404 });
    });
  });
});
