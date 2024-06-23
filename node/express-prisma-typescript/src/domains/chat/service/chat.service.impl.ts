import { ConflictException, HttpException, ValidationException } from "@utils";
import { MessageDTO } from "../dto";
import { ChatRepository } from "../repository";
import { ChatService } from "./chat.service";

export class ChatServiceImpl implements ChatService {
  constructor(private readonly repository: ChatRepository){}
  
  async sendMessage (userId: string, receiverId: string, content: string): Promise<MessageDTO> {
    if(!content){
      throw new ValidationException([{ field: 'content', message: 'Invalid content' }])
    }
    try {
      await this.repository.usersFollowEachOther(userId, receiverId)
      
      return await this.repository.sendMessage(userId, receiverId, content)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error getting comments: ${error}`)
    }
  }

  async getMessages (userId: string, receiverId: string): Promise<MessageDTO[]>{
    try {
      return await this.repository.getMessages(userId, receiverId)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error getting comments: ${error}`)
    }
  }
}