import { PrismaClient } from '@prisma/client'
import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";
import { NotFoundException } from '@utils'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async react(userId: string, postId: string, type: ReactionType, update = false): Promise<ReactionDTO> {
    let reaction
    
    if(update){
      reaction = await this.db.reaction.update({
        where: {
          unique_user_post_reaction: {
            userId: userId,
            postId: postId,
            type: type
          }
        },
        data: {
          deletedAt: null
        }
      })
    } else {
      reaction = await this.db.reaction.create({
        data: {
          userId,
          postId,
          type,
        },
      })
    }
    
    return new ReactionDTO({...reaction, deletedAt: undefined});
  }

  async unreact(userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.db.reaction.update({
      where: {
        unique_user_post_reaction: {
          userId: userId,
          postId: postId,
          type: type
        }
      },
      data: {
        deletedAt: new Date()
      }
    })
  }
  
  async get(userId: string): Promise<ReactionDTO[]>;
  async get(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO>;
  async get(userId: string, postId: string): Promise<ReactionDTO>
  async get(userId: string, postId?: string, type?: ReactionType): Promise<ReactionDTO | ReactionDTO[]> {
    
    //TODO simplify and add restriction based on usedId
    if (postId && type) {
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
        throw new NotFoundException('Reaction not found');
      }

      let deleteAt = reaction?.deletedAt ?? undefined;

      return new ReactionDTO({...reaction, deletedAt: deleteAt});

    } else if (postId) {
      // Implementation for fetching reactions by userId and postId
      const reactions = await this.db.reaction.findMany({
        where: {
          userId,
          postId,
        },
      });

      return reactions.map(reaction => {
        let deleteAt = reaction?.deletedAt ?? undefined;
        return new ReactionDTO({...reaction, deletedAt: deleteAt})
      });

    } else {
      // Implementation for fetching reactions by userId
      const reactions = await this.db.reaction.findMany({
        where: {
          userId,
        },
      });

      return reactions.map(reaction => {
        let deleteAt = reaction?.deletedAt ?? undefined;
        return new ReactionDTO({...reaction, deletedAt: deleteAt})
      });
    }
  }
}

