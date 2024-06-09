import { PrismaClient } from '@prisma/client'
import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async react(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO> {
    const reaction = await this.db.reaction.create({
      data: {
        userId,
        postId,
        type,
      },
    });
    return new ReactionDTO({...reaction, deletedAt: undefined});
  }

  async unreact(userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.db.reaction.deleteMany({
      where: {
        userId,
        postId,
        type,
      },
    });
  }
  
  async get(userId: string): Promise<ReactionDTO[]>;
  async get(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO>;
  async get(userId: string, reactionId: string): Promise<ReactionDTO>
  async get(userId: string, postId?: string, type?: ReactionType, reactionId?: string): Promise<ReactionDTO | ReactionDTO[]> {
    
    //TODO simplify and add restriction based on usedId
    if (reactionId){
      // Implementation for fetching a specific reaction by reactionId
      const reaction = await this.db.reaction.findUnique({
        where: {
          id: reactionId
        },
      });

      if (!reaction) {
        throw new Error('Reaction not found');
      }

      return new ReactionDTO({...reaction, deletedAt: undefined});
    }
    else if (postId && type) {
      // Implementation for fetching a specific reaction by userId, postId, and type
      const reaction = await this.db.reaction.findUnique({
        where: {
          unique_user_post_reaction: {
            userId,
            postId,
            type,
          },
        },
      });

      if (!reaction) {
        throw new Error('Reaction not found');
      }

      return new ReactionDTO({...reaction, deletedAt: undefined});

    } else if (postId) {
      // Implementation for fetching reactions by userId and postId
      const reactions = await this.db.reaction.findMany({
        where: {
          userId,
          postId,
        },
      });

      return reactions.map(reaction => new ReactionDTO({...reaction, deletedAt: undefined}));

    } else {
      // Implementation for fetching reactions by userId
      const reactions = await this.db.reaction.findMany({
        where: {
          userId,
        },
      });

      return reactions.map(reaction => new ReactionDTO({...reaction, deletedAt: undefined}));
    }
  }
}

