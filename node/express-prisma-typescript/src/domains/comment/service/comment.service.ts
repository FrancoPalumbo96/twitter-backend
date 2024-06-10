import { PostDTO } from "@domains/post/dto";

export interface CommentService {
  get: (userId: string, authorId: string) => Promise<PostDTO[]>
}