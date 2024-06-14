import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CursorPagination } from "@types";

export interface CommentRepository {
  get (userId: string, authorId: string): Promise<PostDTO[]>
  getByPostId (userId: string, postId: string, cursorPagination: CursorPagination): Promise<ExtendedPostDTO[]>
}