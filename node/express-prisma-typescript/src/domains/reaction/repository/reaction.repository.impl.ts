import { PrismaClient } from '@prisma/client'
import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";
import { NotFoundException, ValidationException } from '@utils'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async react(userId: string, postId: string, type: ReactionType, update = false): Promise<ReactionDTO> {
    try {
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

      if(reaction)
        return new ReactionDTO({...reaction, deletedAt: undefined});
      else
        throw new ValidationException([{ field: 'postId', message: 'Invalid postId' }])

    } catch (error) {
      throw new ValidationException([{ field: 'postId', message: 'Invalid postId' }])
    }
  }

  async unreact(userId: string, postId: string, type: ReactionType): Promise<void> {
    try {
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
    } catch (error) {
      throw new ValidationException([{ field: 'postId', message: 'Invalid postId' }])
    } 
  }
  
  async get(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO | undefined> {
    try {
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
        return undefined
      }

      let deleteAt = reaction?.deletedAt ?? undefined;
      return new ReactionDTO({...reaction, deletedAt: deleteAt});

    } catch (error) {
      throw new ValidationException([
        { field: 'postId', message: 'Invalid postId' }
      ])
    }
  }
}

