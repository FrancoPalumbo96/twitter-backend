import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CommentService } from "./comment.service";
import { CommentRepository } from "../repository";

export class CommentServiceImpl implements CommentService {
  constructor(private readonly repository: CommentRepository){}

  async get (userId: string, authorId: string): Promise<PostDTO[]>{
    return await this.repository.get(userId, authorId)
  }

  async getByPostId (userId: string, postId: string): Promise<ExtendedPostDTO[]>{
    const comments = await this.repository.getByPostId(userId, postId)

    return comments
  }
}