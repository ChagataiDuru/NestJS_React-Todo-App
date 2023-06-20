import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  description: string

  @IsString()
  @ApiProperty()
  completed: boolean

  @ApiProperty()
  owner: Types.ObjectId
}