import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, ValidationException, ConflictException, HttpException } from '@utils'
import { CursorPagination } from '@types'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    try {
      return await this.repository.create(userId, data)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error creating post: ${error}`);
    }
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    try {
      const post = await this.repository.getById(postId, userId)
      if (!post) 
        throw new NotFoundException('post')

      if (post.authorId !== userId) 
        throw new ForbiddenException()

      await this.repository.delete(postId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error deleting post: ${error}`);
    }
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    try {
      let post = await this.repository.getById(postId, userId)
      if (!post) 
        throw new NotFoundException('post')

      return post
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching post: ${error}`);
    }
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    try {
      if(!options)
        throw new ValidationException([{ field: 'options', message: 'Invalid Cursor Pagination' }])
  
      let posts: ExtendedPostDTO[] = await this.repository.getAllAvailable(options, userId)
  
      return posts  
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching posts: ${error}`);
    }
  }

  async getPostsByAuthor (userId: string, authorId: string): Promise<ExtendedPostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them

    try {
      return await this.repository.getByAuthorId(authorId, userId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching post: ${error}`);
    }
  }
}
