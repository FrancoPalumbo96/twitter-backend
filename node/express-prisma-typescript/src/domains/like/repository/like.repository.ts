import { ReactionDTO } from "@domains/reaction/dto";

export interface LikeRepository {
  get (userId: string, authorId: string) : Promise<ReactionDTO[]>
}