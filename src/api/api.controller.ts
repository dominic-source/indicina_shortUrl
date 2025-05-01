import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ApiService } from './api.service';
import { EncodeDto } from './dto/encode.dto';
import { DecodeDto } from './dto/decode.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('encode')
  @UsePipes(new ValidationPipe({ transform: true }))
  encodeUrl(@Body() encodeDto: EncodeDto) {
    return this.apiService.encodeUrl(encodeDto);
  }

  @Post('decode')
  @UsePipes(new ValidationPipe({ transform: true }))
  decodeUrl(@Body() decodeDto: DecodeDto) {
    const result = this.apiService.decodeUrl(decodeDto);
    if (result === 'URL not found') {
      throw new BadRequestException('URL not found');
    }
    return result;
  }

  @Get('statistic/:urlPath')
  getStatistics(@Param('urlPath') urlPath: string) {
    return this.apiService.getStatistics(urlPath);
  }

  @Get('list')
  listAllUrl() {
    return this.apiService.listAllUrl();
  }
}
