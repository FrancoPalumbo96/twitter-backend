import { LikeRepository } from './like.repository'
import { PrismaClient, ReactionType } from '@prisma/client';
import { ReactionDTO } from '@domains/reaction/dto';

export class LikeRepositoryImpl implements LikeRepository {
  constructor(private readonly db: PrismaClient){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]> {
    const likes = await this.db.reaction.findMany({
      where: {
        userId: authorId,
        deletedAt: null,
        type: ReactionType.LIKE,
        OR: [
          {
            // Post author is not a private user
            post: {
              author: {
                privateUser: false,
                deletedAt: null
              }
            }
          },
          {
            // User follows the Post author
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

    return likes.map(like => {
      let deleteAt = like?.deletedAt ?? undefined;
      return new ReactionDTO({...like, deletedAt: deleteAt})
    })
  }
}