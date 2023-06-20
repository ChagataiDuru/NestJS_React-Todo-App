import { Expose } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';

export class TodoDto {

    @Expose()
    @ApiProperty()
    todoId: number;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    @ApiProperty()
    completed: boolean;

}