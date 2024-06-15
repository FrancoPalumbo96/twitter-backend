import { RetweetService } from "./retweet.service";
import { RetweetRepository } from "../repository";
import { ReactionDTO } from "@domains/reaction/dto";
import { ConflictException, HttpException } from "@utils";


export class RetweetServiceImpl implements RetweetService {
  constructor(private readonly repository: RetweetRepository){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]>{
    try {
      return await this.repository.get(userId, authorId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching retweets: ${error}`);
    }
  }
}