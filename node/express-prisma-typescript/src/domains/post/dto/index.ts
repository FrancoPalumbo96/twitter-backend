import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ExtendedUserDTO } from '@domains/user/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @MaxLength(4)
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
 *         images:
 *           type: string[]
 *           description: The post image
 *           example: ...
 *         content:
 *           type: string
 *           description: post content
 *           example: This is a post! 
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
