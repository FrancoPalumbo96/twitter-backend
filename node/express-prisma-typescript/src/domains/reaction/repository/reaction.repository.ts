import { ReactionType } from "@prisma/client";
import { ReactionDTO } from "../dto";

export interface ReactionRepository {
    react: (userId: string, postId: string, type: ReactionType, update?: boolean) => Promise<ReactionDTO>
    unreact: (userId: string, postId: string, type: ReactionType) => Promise<void>
    get(userId: string, postId: string, type: ReactionType): Promise<ReactionDTO | undefined>
}