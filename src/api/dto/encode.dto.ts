import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class EncodeDto {
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  @Matches(
    /^(https?:\/\/((localhost(:\d+)?|[\w-]+(\.[\w-]+)*\.[a-z]{2,})))(\/[\w\-~!$&'()*+,;=:@%]*)*(\?[\w\-~!$&'()*+,;=:@%/?]*)?(#[\w\-~!$&'()*+,;=:@%/?]*)?$/,
    { message: 'Must be a valid URL (e.g., https://example.com, https://localhost:3000)' },
  )
  longUrl: string;
}
