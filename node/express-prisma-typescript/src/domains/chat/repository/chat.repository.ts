import { MessageDTO } from "../dto"

export interface ChatRepository {
  sendMessage: (userId: string, receiverId: string, content: string) => Promise<MessageDTO>
  getMessages: (userId: string, receiverId: string) => Promise<MessageDTO[]>
  usersFollowEachOther: (userId: string, receiverId: string) => Promise<void>
}