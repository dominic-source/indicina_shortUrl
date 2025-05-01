import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class DecodeDto {
  @IsNotEmpty({ message: 'Short URL cannot be empty' })
  @IsString({ message: 'Short URL must be a string' })
  @IsUrl({}, { message: 'Must be a valid URL' })
  shortUrl: string;
}
