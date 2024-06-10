import { LikeService } from "./like.service";
import { LikeRepository } from "../repository";
import { ReactionDTO } from "@domains/reaction/dto";

export class LikeServiceImpl implements LikeService {
  constructor(private readonly repository: LikeRepository){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]>{
    return await this.repository.get(userId, authorId)
  }
}