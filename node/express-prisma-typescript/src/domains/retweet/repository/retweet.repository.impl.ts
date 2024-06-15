import { RetweetRepository } from './retweet.repository'
import { PrismaClient, ReactionType } from '@prisma/client';
import { ReactionDTO } from '@domains/reaction/dto';
import { ValidationException } from '@utils';

export class RetweetRepositoryImpl implements RetweetRepository {
  constructor(private readonly db: PrismaClient){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]> {
    try {
      const retweets = await this.db.reaction.findMany({
        where: {
          userId: authorId,
          deletedAt: null,
          type: ReactionType.RETWEET,
          OR: [
            {
              // Post Author is not a private user
              post: {
                author: {
                  privateUser: false,
                  deletedAt: null
                }
              }
            },
            {
              // User follows the Post Author
              post: {
                author: {
                  followers: {
                    some: {
                      followerId: userId,
                      deletedAt: null,
                    }
                  }
                }
              }
            },
            {
              // User is the Post Author
              post: {
                author: {
                  id: userId
                }
              }
            }
          ]
        }
      })
  
      return retweets.map(retweet => {
        let deleteAt = retweet?.deletedAt ?? undefined;
        return new ReactionDTO({...retweet, deletedAt: deleteAt})
      })
    } catch (error) {
      throw new ValidationException([{ field: 'authorId', message: 'Invalid author user id' }])
    }
  }
}