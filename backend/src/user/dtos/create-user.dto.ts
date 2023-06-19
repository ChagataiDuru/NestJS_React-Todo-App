import { OmitType } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  fullName: string

  @IsEmail()
  email: string

  @IsString()
  bio: string

  @IsString()
  password: string
}

export class UpdateUserInput extends OmitType(CreateUserDto, [
  'password'
] as const) {}