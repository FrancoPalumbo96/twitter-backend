import { RetweetService } from "./retweet.service";
import { RetweetRepository } from "../repository";
import { ReactionDTO } from "@domains/reaction/dto";


export class RetweetServiceImpl implements RetweetService {
  constructor(private readonly repository: RetweetRepository){}

  async get (userId: string, authorId: string): Promise<ReactionDTO[]>{
    return await this.repository.get(userId, authorId)
  }
}