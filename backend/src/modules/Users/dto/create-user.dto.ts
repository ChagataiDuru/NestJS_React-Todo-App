import { IsString, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsNumber()
    readonly id: number;
    @IsString()
    readonly name: string;
    @IsString()
    readonly surname: string;
    @IsString()
    readonly email: string;
    @IsString()
    readonly password: string;
}