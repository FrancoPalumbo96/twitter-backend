import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CommentService } from "./comment.service";
import { CommentRepository } from "../repository";
import { CursorPagination } from "@types";

export class CommentServiceImpl implements CommentService {
  constructor(private readonly repository: CommentRepository){}

  async get (userId: string, authorId: string): Promise<PostDTO[]>{
    return await this.repository.get(userId, authorId)
  }

  async getByPostId (userId: string, postId: string): Promise<ExtendedPostDTO[]>{
    
    //Examples of usages for cursor paginator
    //const cursorPagination: CursorPagination = {limit: 1, after: "071f8c0e-c623-4421-a83d-a08dfc00daf4"}
    //const cursorPagination: CursorPagination = {limit: 1}
    const cursorPagination: CursorPagination = {limit: 5}

    const comments = await this.repository.getByPostId(userId, postId, cursorPagination)

    return comments
  }
}