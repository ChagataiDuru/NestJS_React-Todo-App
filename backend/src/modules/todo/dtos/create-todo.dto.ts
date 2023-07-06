import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  description: string

  @ApiProperty()
  due: Date

  @ApiPropertyOptional()
  completed: boolean

  @ApiPropertyOptional()
  owner: Types.ObjectId

  @ApiPropertyOptional()
  approved: boolean

}