import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  title: string

  @IsEmail()
  @IsOptional()
  @ApiProperty()
  description: string

  @IsString()
  @ApiProperty()
  completed: boolean
}
