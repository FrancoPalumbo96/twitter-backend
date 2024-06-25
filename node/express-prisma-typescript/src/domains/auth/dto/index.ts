import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'

export class TokenDTO {
  token!: string
}


/**
 *@swagger
 *components:
 *  schemas:
 *    SignupInputDTO:
 *      type: object
 *      required:
 *        - email
 *        - username
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: Email of the user
 *          example: pedro@example.com
 *          format: email
 *        username:
 *          type: string
 *          description: Username of the user
 *          example: pedro_96
 *        password:
 *          type: string
 *          description: Password of the user
 *          example: Strong_Password_00
 *        name:
 *          type: string
 *          description: Name of the user
 *          example: Pedro
 *        privateUser:
 *          type: boolean
 *          description: Is a private user
 *          example: true
 */

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


/**
 *@swagger
 *components:
 *  schemas:
 *    LoginInputDTO:
 *      type: object
 *      required:
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          description: Email of the user
 *          example: pedro@example.com
 *          format: email
 *        username:
 *          type: string
 *          description: Username of the user
 *          example: pedro_96
 *        password:
 *          type: string
 *          description: Password of the user
 *          example: Strong_Password_00
 */
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
