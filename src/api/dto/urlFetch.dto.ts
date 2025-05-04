import { IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UrlFetchDto {
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  @IsUrl({ require_tld: false }, { message: 'Must be a valid URL' })
  longUrl?: string;

  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  @IsUrl({ require_tld: false }, { message: 'Must be a valid URL' })
  shortUrl?: string;

  @IsDate()
  @IsNotEmpty({ message: 'Created date cannot be empty' })
  createdAt?: string;

  @IsNotEmpty({ message: 'Visits cannot be empty' })
  visits?: string;

  @IsDate()
  lastVisited?: string;
}
