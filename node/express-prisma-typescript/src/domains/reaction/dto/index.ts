import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ReactionType } from '@prisma/client'

/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionInputDTO:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           description: Type of reaction.
 *           enum: [LIKE, RETWEET]
 *           example: "LIKE"
 */
export class ReactionInputDTO {
  @IsString()
  @IsNotEmpty()
  type: string

  constructor(type: string){
    this.type = type
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReactionDTO:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - postId
 *         - type
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the reaction.
 *           example: "12345"
 *         userId:
 *           type: string
 *           description: ID of the user who reacted.
 *           example: "67890"
 *         postId:
 *           type: string
 *           description: ID of the post reacted to.
 *           example: "54321"
 *         type:
 *           type: string
 *           enum: [LIKE, RETWEET]
 *           description: Type of reaction.
 *           example: "LIKE"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the reaction was created.
 *           example: "2024-06-24T14:30:00.000Z"
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Optional. Date and time when the reaction was deleted.
 *           example: "2024-06-25T10:00:00.000Z"
 */
export class ReactionDTO {
  constructor(reaction: ReactionDTO){
      this.id = reaction.id
      this.userId = reaction.userId
      this.postId = reaction.postId
      this.type = reaction.type
      this.createdAt = reaction.createdAt
      this.deletedAt = reaction.deletedAt
  }

  id: string
  userId: string
  postId: string
  type: ReactionType
  createdAt: Date
  deletedAt?: Date
}