import { describe, expect } from '@jest/globals'
import { ChatRepositoryImpl, ChatServiceImpl } from "@domains/chat"
import { prismaMock } from "./config"
import { follows, messages, users } from "./data"
import { MessageDTO } from "@domains/chat/dto"

describe('Chat Service', () => {
  const chatService = new ChatServiceImpl(new ChatRepositoryImpl(prismaMock))

  test('should send a message to mutualy followed user successfully', async () => {
    const sender = users[0]
    const receiver = users[1]
    const followSR = follows[0]
    const followRS = follows[1]
    const message = messages[0]
    const messageDTO: MessageDTO = new MessageDTO(message)
    
    prismaMock.message.create.mockResolvedValue(message)
    prismaMock.follow.findUnique.mockResolvedValue(followSR)
    prismaMock.follow.findUnique.mockResolvedValue(followRS)

    const result = await chatService.sendMessage(sender.id, receiver.id, message.content)

    expect(result).toEqual(messageDTO)

  })

  test('should not be able to send a message to a user i do not follow', async () => {
    const sender = users[0]
    const receiver = users[1]
    const message = messages[0]
    const messageDTO: MessageDTO = new MessageDTO(message)
    
    prismaMock.message.create.mockResolvedValue(message)
    prismaMock.follow.findUnique.mockResolvedValue(null)
    

    await expect(chatService.sendMessage(sender.id, receiver.id, message.content))
      .rejects.toThrow('Validation Error')
  })

  test('should get all messages sent to user', async () => {
    const sender = users[0]
    const receiver = users[1]
    
    const messagesDTO: MessageDTO[] = [
      new MessageDTO(messages[0]),
      new MessageDTO(messages[1])
    ]
    
    prismaMock.message.findMany.mockResolvedValue(messages)

    const result = await chatService.getMessages(sender.id, receiver.id)

    expect(result).toEqual(messagesDTO)
  })
})