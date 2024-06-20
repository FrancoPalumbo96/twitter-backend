import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CommentService } from "./comment.service";
import { CommentRepository } from "../repository";
import { CursorPagination } from "@types";
import { ConflictException, HttpException } from "@utils";

export class CommentServiceImpl implements CommentService {
  constructor(private readonly repository: CommentRepository){}

  async get (userId: string, authorId: string): Promise<PostDTO[]>{
    try {
      return await this.repository.get(userId, authorId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error getting comments: ${error}`);
    }
    
  }

  
  async getByPostId (userId: string, postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]>{
    try {
      const comments = await this.repository.getByPostId(userId, postId, options)

      return comments
    } catch (error) {
      throw new ConflictException(`Error getting comments by postId: ${error}`);
    }
  }
}