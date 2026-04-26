import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export const LOGIN_ID_PATTERN = /^[A-Za-z0-9_]{3,32}$/;

export class RegisterDto {
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

  @ApiProperty({ minLength: 1, maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;
}
