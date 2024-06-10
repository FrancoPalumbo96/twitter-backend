import { PostDTO } from '@domains/post/dto';
import { CommentRepository } from './comment.repository'
import { PrismaClient } from '@prisma/client';

export class CommentRepositoryImpl implements CommentRepository {
  constructor(private readonly db: PrismaClient){}

  async get (userId: string, authorId: string): Promise<PostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        authorId: authorId,
        deletedAt: null,
        parentId: {
          not: null
        },
        OR: [
          {
            // Author is not a private user
            author: {
              privateUser: false,
              deletedAt: null
            },
          },
          {
            // User follows the author
            author: {
              followers: {
                some: {
                  followerId: userId,
                  deletedAt: null,
                },
              },
            },
          },
          {
            // User is the Author
            author: {
              id: userId
            }
          }
        ]
      }
    })

    return comments.map(comment => new PostDTO(comment))
  }
}