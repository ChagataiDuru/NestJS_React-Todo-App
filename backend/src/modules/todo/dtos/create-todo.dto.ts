import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'
import { Types } from 'mongoose'

export class CreateTodoDto {
  @IsString()
  @ApiProperty()
  title: string

  @IsString()
  @ApiProperty()
  description: string

  @IsBoolean()
  @ApiProperty()
  completed: boolean

  @ApiProperty()
  owner: Types.ObjectId

  @IsBoolean()
  @ApiProperty()
  approved: boolean
}