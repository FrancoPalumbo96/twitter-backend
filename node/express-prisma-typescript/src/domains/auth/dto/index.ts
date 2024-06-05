import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class TokenDTO {
  token!: string
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsString()
  @IsNotEmpty()
    username: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password: string

  @IsString()
  @IsOptional()
    name: string

  @IsBoolean()
  @IsOptional()
    privateUser: boolean

  constructor (email: string, username: string, password: string, name?: string, privateUser?: boolean) {
    this.email = email
    this.password = password
    this.username = username
    this.name = name || username; 
    this.privateUser = privateUser ?? false
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
    email?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
    username?: string

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
    password!: string
}
