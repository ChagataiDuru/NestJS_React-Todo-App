import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  description: string

  @ApiPropertyOptional()
  completed: boolean

  @ApiPropertyOptional()
  owner: Types.ObjectId

  @ApiPropertyOptional()
  approved: boolean

}