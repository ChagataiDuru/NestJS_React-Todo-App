import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  body: string

  @IsString()
  @ApiPropertyOptional()
  notificationType: string


  @ApiPropertyOptional()
  user: Types.ObjectId

  @ApiPropertyOptional()
  todo: Types.ObjectId
  
}