import { ExtendedPostDTO, PostDTO } from '@domains/post/dto';
import { CommentRepository } from './comment.repository'
import { PrismaClient } from '@prisma/client';
import { NotFoundException } from '@utils'
import { ExtendedUserDTO } from '@domains/user/dto';

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

  async getByPostId (userId: string, postId: string): Promise<ExtendedPostDTO[]> {
    const originalPost = await this.db.post.findFirst({
      where: {
        id: postId,
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

    if(originalPost?.deletedAt){
      throw new NotFoundException('Post does not exists') //original post was deleted
    }

    const commentsInPostAndReactions = await this.db.post.findMany({
      where: {
        parentId: postId, //parentId is the original post 
      },
      include: {
        _count: {
          select: {
            reactions: true, //can be removed
            comments: true,
          },
        },
        reactions: true, //Add reactons for filtering
        author: true,    //Add author for ExtendedPostDTO
      },
      orderBy: {
        reactions: {
          _count: 'desc', //Sort by number of reactions
        },
      },
    })

    //sorted by reactions
    const processedComments = commentsInPostAndReactions.map(comment => {
      const likeCount = comment.reactions.filter(reaction => reaction.type === 'LIKE').length;
      const retweetCount = comment.reactions.filter(reaction => reaction.type === 'RETWEET').length;

      return new ExtendedPostDTO({
        id: comment.id,
        authorId: comment.authorId,
        content: comment.content,
        images: comment.images,
        createdAt: comment.createdAt,
        parentId: comment.parentId,
        author: new ExtendedUserDTO({...comment.author}),
        qtyComments: comment._count.comments,
        qtyLikes: likeCount,
        qtyRetweets: retweetCount,
      });
    });

    return processedComments;
  }
}