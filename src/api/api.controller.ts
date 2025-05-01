import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('encode')
  encodeUrl(@Body() encodeDto: EncodeDto) {
    return this.apiService.encodeUrl(encodeDto);
  }

  @Post('decode')
  decodeUrl(@Body() decodeDto: DecodeDto) {
    return this.apiService.decodeUrl(decodeDto);
  }

  @Get('statistics/:urlPath')
  getStatistics(@Param('urlPath') urlPath: string) {
    return this.apiService.getStatistics(urlPath);
  }

  @Get('list')
  listAllUrl() {
    return this.apiService.listAllUrl();
  }
}
