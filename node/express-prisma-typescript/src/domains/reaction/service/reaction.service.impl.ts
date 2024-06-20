import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { ReactionDTO } from "../dto";
import { NotFoundException, ConflictException, ValidationException, HttpException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async react (userId: string, postId: string, type: string): Promise<ReactionDTO> {
    try {
      const reactionType = this.castReactionType(type);

      if(!reactionType)
        throw new ValidationException([{ field: 'type', message: 'Invalid reaction type' }])

      const reaction: ReactionDTO | undefined = await this.repository.get(userId, postId, reactionType)

      if(reaction){
        if(!reaction.deletedAt){
          throw new ConflictException(`Cannot ${reaction.type} twice that post`) //cannot react twice
        }

        return await this.repository.react(userId, postId, reactionType, true); //update reaction
      } else {
        return await this.repository.react(userId, postId, reactionType); //create reaction
      }      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error at react: ${error}`);
    }
  }

  async unreact (userId: string, postId: string, type: string): Promise<void> {
    try {
      const reactionType = this.castReactionType(type);

      if(!reactionType)
        throw new ConflictException('Reaction type does not exist')

      const reaction: ReactionDTO | undefined = await this.repository.get(userId, postId, reactionType);

      if(!reaction){
        throw new NotFoundException('Reaction')
      }

      await this.repository.unreact(userId, reaction.postId, reaction.type)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error at unreact: ${error}`);
    }
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