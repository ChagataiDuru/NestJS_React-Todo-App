import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsEmail()
  @ApiProperty()
  description: string

  @IsString()
  @ApiProperty()
  completed: boolean
}