import { ReactionType } from "@prisma/client";
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";
import { ReactionDTO } from "../dto";
import { NotFoundException, ConflictException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async react (userId: string, postId: string, type: ReactionType): Promise<ReactionDTO> {
    return await this.repository.react(userId, postId, type);
  }

  async unreact (userId: string, reactionId: string): Promise<void> {
    const reaction: ReactionDTO = await this.repository.get(userId, reactionId = reactionId);

    if(!reaction){
      throw new NotFoundException('Could not found Reaction')
    }

    await this.repository.unreact(userId, reaction.postId, reaction.type)
  }
}