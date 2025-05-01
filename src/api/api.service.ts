import { Injectable } from '@nestjs/common';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';

@Injectable()
export class ApiService {
  encodeUrl(encodeDto: EncodeDto): string {
    
    return ''
  }

  decodeUrl(decodeDto: DecodeDto): string {
    return ''
  }

  getStatistics(urlPath: string): string {
    return ''
  }

  listAllUrl(): string {
    return ''
  }
}
