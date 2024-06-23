import { MessageDTO } from "../dto";

export interface ChatService {
  sendMessage: (userId: string, receiverId: string, content: string) => Promise<MessageDTO>
  getMessages: (userId: string, receiverId: string) => Promise<MessageDTO[]>
}