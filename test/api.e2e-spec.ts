import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;
  const message = 'Must be a valid URL (e.g., https://example.com, https://localhost:3000)';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/encode', () => {
    it('should encode a long URL and return a shorter one', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl: 'https://example.com/this/is/a/very/long/url/that/needs/to/be/shortened' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('shortUrl');
          expect(typeof res.body.shortUrl).toBe('string');
          expect(res.body.shortUrl.length).toBeLessThan(60);
          expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow(); // Check valid JSON
        });
    });

    it('should return the same short URL for the same long URL', async () => {
      const longUrl = 'https://example.com/consistent/url/test';
      
      // First request
      const firstResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl })
        .expect(201);
      
      const firstShortUrl = firstResponse.body.shortUrl;
      
      // Second request with the same long URL
      const secondResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl })
        .expect(201);
      
      const secondShortUrl = secondResponse.body.shortUrl;
      
      expect(secondShortUrl).toBe(firstShortUrl);
    });

    it('should return validation error for invalid URLs', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl: 'not-a-valid-url' })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
          expect(res.body.message).toContain(message);
        });
    });

    it('should return validation error for empty URL', () => {
      return request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl: '' })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
          expect(res.body.message).toContain('URL cannot be empty');
        });
    });
  });

  describe('POST /api/decode', () => {
    it('should decode a short URL back to the original long URL', async () => {
      // First create a short URL
      const longUrl = 'https://example.com/decode/test/url';
      const encodeResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl })
        .expect(201);
      
      const shortUrl = encodeResponse.body.shortUrl;
      
      // Then decode it
      return request(app.getHttpServer())
        .post('/api/decode')
        .send({ shortUrl })
        .expect(201)
        .expect((res) => {
          console.log(res.body);
          expect(res.body).toHaveProperty('longUrl', longUrl);
          expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
        });
    });

    it('should return 400 for non-existent short URLs', () => {
      return request(app.getHttpServer())
        .post('/api/decode')
        .send({ shortUrl: 'http://localhost:3000/nonexistent' })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('URL not found');
        });
    });

    it('should return validation error for invalid short URLs', () => {
      return request(app.getHttpServer())
        .post('/api/decode')
        .send({ shortUrl: 'not-a-valid-url' })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(Array.isArray(res.body.message)).toBe(true);
          expect(res.body.message).toContain(message);
        });
    });
  });

  describe('GET /api/statistic/:urlPath', () => {
    it('should return statistics for a valid URL path', async () => {
      // First create a short URL
      const longUrl = 'https://example.com/stats/test/url';
      const encodeResponse = await request(app.getHttpServer())
        .post('/api/encode')
        .send({ longUrl })
        .expect(201);
      
      const shortUrl = encodeResponse.body.shortUrl;
      const urlPath = shortUrl.split('/').pop();
      
      // Then get statistics
      return request(app.getHttpServer())
        .get(`/api/statistic/${urlPath}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('longUrl', longUrl);
          expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow(); // Check valid JSON
        });
    });
  });
});
