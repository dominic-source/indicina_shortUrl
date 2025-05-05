import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class DecodeDto {
  @IsNotEmpty({ message: 'Short URL cannot be empty' })
  @IsString({ message: 'Short URL must be a string' })
  @Matches(
    /^(https?:\/\/((localhost(:\d+)?|[\w-]+(\.[\w-]+)*\.[a-z]{2,})))(\/[\w\-~!$&'()*+,;=:@%]*)*(\?[\w\-~!$&'()*+,;=:@%/?]*)?(#[\w\-~!$&'()*+,;=:@%/?]*)?$/,
    { message: 'Must be a valid URL (e.g., https://example.com, https://localhost:3000)' },
  )
  shortUrl: string;
}
