import { LikeService } from "./like.service";
import { LikeRepository } from "../repository";
import { ReactionDTO } from "@domains/reaction/dto";
import { ConflictException, HttpException } from "@utils";

export class LikeServiceImpl implements LikeService {
  constructor(private readonly repository: LikeRepository){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]>{
    try {
      return await this.repository.get(userId, authorId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching likes: ${error}`)
    }
  }
}