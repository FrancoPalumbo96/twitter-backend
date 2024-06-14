import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { ReactionDTO } from "../dto";
import { NotFoundException, ConflictException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async react (userId: string, postId: string, type: string): Promise<ReactionDTO> {
    const reactionType = this.castReactionType(type);

    if(!reactionType)
      throw new ConflictException('Reaction type does not exist')

    try {
      const reaction: ReactionDTO = await this.repository.get(userId, postId, reactionType)

      if(!reaction.deletedAt){
        throw new ConflictException(`Cannot ${reaction.type} twice that post`) //cannot react twice
      }

      return await this.repository.react(userId, postId, reactionType, true); //update reaction
    } catch (error) {
      return await this.repository.react(userId, postId, reactionType); //create reaction
    }
  
  }

  async unreact (userId: string, postId: string, type: string): Promise<void> {
    const reactionType = this.castReactionType(type);
    if(!reactionType)
      throw new ConflictException('Reaction type does not exist')

    const reaction: ReactionDTO = await this.repository.get(userId, postId, reactionType);

    if(!reaction){
      throw new NotFoundException('Could not found Reaction')
    }

    await this.repository.unreact(userId, reaction.postId, reaction.type)
  }

  castReactionType(type: string): ReactionType | null {
    const lowercaseType: string = type.toLocaleLowerCase();
    if(lowercaseType === '0' || lowercaseType === 'like'){
      return ReactionType.LIKE
    }
    if(lowercaseType === '1' || lowercaseType === 'retweet'){
      return ReactionType.RETWEET
    }

    return null;
  }
}