import { ReactionType } from "@prisma/client"
import { ReactionDTO } from "../dto"

export interface ReactionService {
  react: (userId: string, postId: string, type: string) => Promise<ReactionDTO>
  unreact: (userId: string, postId: string, type: string) => Promise<void>
}