import { ExtendedPostDTO, PostDTO } from "@domains/post/dto";

export interface CommentRepository {
  get (userId: string, authorId: string): Promise<PostDTO[]>
  getByPostId (userId: string, postId: string): Promise<ExtendedPostDTO[]>
}