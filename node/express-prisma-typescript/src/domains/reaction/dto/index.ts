import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ReactionType } from '@prisma/client'


export class ReactionInputDTO {
  @IsString()
  @IsNotEmpty()
  type: string

  constructor(type: string){
    this.type = type
  }
}

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