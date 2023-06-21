import { Expose, Transform, Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from "src/modules/user/dtos/user.dto";
import { Types } from "mongoose";
import { UserDocument } from "src/modules/user/user.schema";

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
    @Type(() => UserDto)
    @Transform(({ value }) => ({ userId: value.userId, fullName: value.fullName, email: value.email }))
    @ApiProperty()
    owner: UserDto | string | Types.ObjectId | UserDocument;

}