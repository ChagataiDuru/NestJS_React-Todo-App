import { Expose, Transform, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { Types } from "mongoose";

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

    @Expose()
    @ApiProperty()
    approved: boolean;

    @Expose()
    @ApiProperty()
    userId: string | Types.ObjectId;

}