import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { LOGIN_ID_PATTERN } from './register.dto';

export class LoginDto {
  @ApiProperty({
    minLength: 3,
    maxLength: 32,
    pattern: '^[A-Za-z0-9_]+$',
  })
  @IsString()
  @Matches(LOGIN_ID_PATTERN, {
    message: 'loginId must be 3-32 characters and contain only letters, numbers, or underscore',
  })
  loginId: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
