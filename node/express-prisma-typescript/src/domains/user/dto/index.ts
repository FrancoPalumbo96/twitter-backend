
/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *         name:
 *           type: string
 *           nullable: true
 *           description: Name of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the user was created
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL to the user's profile picture
 *     
 */
export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  createdAt: Date
  profilePicture?: string | null
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ExtendedUserDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/UserDTO'
 *         - type: object
 *           required:
 *             - email
 *             - username
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               description: Email of the user
 *             username:
 *               type: string
 *               description: Username of the user
 *             password:
 *               type: string
 *               description: Password of the user 
 */
export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}

/**
 * components:
 *   schemas:
 *     UserViewDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the user
 *         name:
 *           type: string
 *           description: Name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL to the user's profile picture
 */
export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string
  username: string
  profilePicture: string | null
}
