
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    username: string
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email:string
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password:string
    
    @IsString()
    @IsNotEmpty()
    phone: string
    
    
}


