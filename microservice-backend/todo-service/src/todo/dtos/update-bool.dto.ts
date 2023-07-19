import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBoolTodoDto {


  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  completed: boolean

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  approved: boolean

}
