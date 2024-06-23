import { PrismaClient } from "@prisma/client";
import { ChatRepository } from "./chat.repository";
import { MessageDTO } from "../dto";
import { ValidationException } from "@utils";

export class ChatRepositoryImpl implements ChatRepository {
  constructor(private readonly db: PrismaClient){}

  async sendMessage (userId: string, receiverId: string, content: string): Promise<MessageDTO>{
    try { 
      const message = await this.db.message.create({
        data: {
          senderId: userId,
          receiverId: receiverId,
          content: content
        }
      })
      return new MessageDTO(message)
    } catch (error) {
      throw new ValidationException([{ field: 'receiverId', message: 'Invalid receiverId' }])
    }
  }

  async getMessages (userId: string, receiverId: string): Promise<MessageDTO[]>{
    try {
      const messages = this.db.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: receiverId},
            { senderId: receiverId, receiverId: userId}
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return messages
    } catch (error) {
      throw new ValidationException([{ field: 'receiverId', message: 'Invalid receiverId' }])
    }
  }

  async usersFollowEachOther (userId: string, receiverId: string): Promise<void> {
    try {
      const followUserReceiver = await this.db.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId: userId,
            followedId: receiverId,
          },
        },
      });
  
      const followReceiverUser = await this.db.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId: receiverId,
            followedId: userId,
          },
        },
      });
  
      
      if (!followUserReceiver || !followReceiverUser) {
        throw new ValidationException([{ field: 'receiverId', message: 'Users do not follow each other' }]);
      }
    } catch (error) {
      throw new ValidationException([{ field: 'receiverId', message: 'Invalid receiverId' },
        { field: 'receiverId', message: 'Users do not follow each other' }
      ])
    }
  }
}