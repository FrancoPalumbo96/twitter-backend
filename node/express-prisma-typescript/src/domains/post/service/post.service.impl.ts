import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId, userId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    let post = await this.repository.getById(postId, userId)
    if (!post) 
      throw new NotFoundException('post')

    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    let posts: PostDTO[] = await this.repository.getAllAvailable(options, userId)

    return posts
  }

  async getPostsByAuthor (userId: string, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    return await this.repository.getByAuthorId(authorId, userId)
  }
}
