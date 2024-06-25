import { ArrayMaxSize, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ExtendedUserDTO } from '@domains/user/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @ArrayMaxSize(4)
    images?: string[]
  
  @IsString()
  @IsOptional()
    parentId?: string
}

//Single Parameter as an Object

/**
 * @swagger
 * components:
 *   schemas:
 *     PostDTO:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The post id
 *           example: c9499110-6cfe-47af-b799-20ba6873055e
 *         authorId:
 *           type: string
 *           description: The author id
 *           example: 0f0e94a9-84ee-492e-8ef5-c7b9ae827327
 *         content:
 *           type: string
 *           description: post content
 *           example: This is a post! 
 *         images:
 *           type: string[]
 *           description: The post image
 *           example: ...
 *         createdAt:
 *           type: Date
 *           description: The post creation date
 *           example: 2024-06-14T20:28:27.049Z
 *         parentId:
 *           type: string
 *           description: optional field that stores the Id of the parent post (the post being commented on).
 *           example: 34275a9b-b076-4b41-90e7-fcd72fd27b84
 *             
 */
export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
   
    this.parentId = post.parentId
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
  parentId?: string | null //Added null option else would not work
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ExtendedPostDTO:
 *       allOf:
 *         - $ref: '#/components/schemas/PostDTO'
 *         - type: object
 *           required:
 *             - author
 *             - qtyComments
 *             - qtyLikes
 *             - qtyRetweets
 *           properties:
 *             author:
 *               $ref: '#/components/schemas/ExtendedUserDTO'
 *               description: The author of the post
 *             qtyComments:
 *               type: integer
 *               description: The number of comments on the post
 *               example: 5
 *             qtyLikes:
 *               type: integer
 *               description: The number of likes on the post
 *               example: 100
 *             qtyRetweets:
 *               type: integer
 *               description: The number of retweets/shares of the post
 *               example: 20
 */
export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = post.author
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
  }

  author!: ExtendedUserDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
}
