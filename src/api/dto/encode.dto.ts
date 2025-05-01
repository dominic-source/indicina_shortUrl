import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class EncodeDto {
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  @IsUrl({}, { message: 'Must be a valid URL' })
  longUrl: string;
}
