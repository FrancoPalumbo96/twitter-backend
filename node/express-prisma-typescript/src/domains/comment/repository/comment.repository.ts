import { PostDTO } from "@domains/post/dto";

export interface CommentRepository {
  get (userId: string, authorId: string) : Promise<PostDTO[]>
}