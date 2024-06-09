import { ReactionType } from "@prisma/client"
import { ReactionDTO } from "../dto"

export interface ReactionService {
  react: (userId: string, postId: string, type: ReactionType) => Promise<ReactionDTO>
  unreact: (userId: string, reactionId: string) => Promise<void>
}