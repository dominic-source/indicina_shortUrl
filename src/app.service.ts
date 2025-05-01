import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirectUrl(): string {
    return 'Hello World!';
  }
}
