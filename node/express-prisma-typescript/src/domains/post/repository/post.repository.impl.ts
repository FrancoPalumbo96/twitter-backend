import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllAvailable (options: CursorPagination, userId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,

      where: {
        parentId: null,
        OR: [
          {
            // Posts from public users
            author: {
              privateUser: false,
              deletedAt: null
            }
          },
          {
            // Posts from private users that are followed by userId
            author: {
              followers: {
                some: {
                  followerId: userId,
                  deletedAt: null
                }
              }
            }
          }
        ],
        deletedAt: null
      },

      include: {
        _count: {
          select: {
            reactions: true, //can be removed
            comments: true,
          },
        },
        reactions: true, //Add reactons for filtering
        author: true 
      },

      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => {
      const likeCount = post.reactions.filter(reaction => reaction.type === 'LIKE').length;
      const retweetCount = post.reactions.filter(reaction => reaction.type === 'RETWEET').length;
      return new ExtendedPostDTO({...post, qtyComments: post._count.comments, qtyLikes: likeCount, qtyRetweets: retweetCount })
    })
  }

 
  async getById (postId: string, userId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findFirst({
      where: {
        id: postId,
        parentId: null,
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
      },
    })

    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string, userId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId: authorId,
        parentId: null,
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
      },

      include: {
        _count: {
          select: {
            reactions: true, //can be removed
            comments: true,
          },
        },
        reactions: true, //Add reactons for filtering
        author: true 
      }
    })
    return posts.map(post => {
      const likeCount = post.reactions.filter(reaction => reaction.type === 'LIKE').length;
      const retweetCount = post.reactions.filter(reaction => reaction.type === 'RETWEET').length;
      return new ExtendedPostDTO({...post, qtyComments: post._count.comments, qtyLikes: likeCount, qtyRetweets: retweetCount })
    })
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }
}
