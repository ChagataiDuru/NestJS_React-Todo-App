import { Expose } from "class-transformer";

export class UserDto {

    @Expose()
    userId: number;

    @Expose()
    fullName: string;

    @Expose()
    bio: string;

    @Expose()
    email: string;

}