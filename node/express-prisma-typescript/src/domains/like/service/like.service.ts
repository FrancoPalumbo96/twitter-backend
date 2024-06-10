import { ReactionDTO } from "@domains/reaction/dto";

export interface LikeService {
  get: (userId: string, authorId: string) => Promise<ReactionDTO[]>
}