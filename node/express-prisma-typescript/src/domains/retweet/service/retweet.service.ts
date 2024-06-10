import { ReactionDTO } from "@domains/reaction/dto";

export interface RetweetService {
  get: (userId: string, authorId: string) => Promise<ReactionDTO[]>
}