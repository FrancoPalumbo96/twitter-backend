import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";
import { CursorPagination } from "@types";

export interface CommentService {
  get: (userId: string, authorId: string) => Promise<PostDTO[]>
  getByPostId: (userId: string, postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
}