import { ReactionDTO } from "@domains/reaction/dto";

export interface RetweetRepository {
  get (userId: string, authorId: string) : Promise<ReactionDTO[]>
}