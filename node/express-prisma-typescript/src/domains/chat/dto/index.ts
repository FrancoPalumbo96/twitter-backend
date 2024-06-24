import { Message } from '@prisma/client'

/**
 * @swagger
 * components:
 *   schemas:
 *     MessageDTO:
 *       type: object
 *       required:
 *         - id
 *         - senderId
 *         - receiverId
 *         - content
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the message.
 *           example: "12345"
 *         senderId:
 *           type: string
 *           description: ID of the user who sent the message.
 *           example: "67890"
 *         receiverId:
 *           type: string
 *           description: ID of the user who received the message.
 *           example: "54321"
 *         content:
 *           type: string
 *           description: Content of the message.
 *           example: "Hello, how are you?"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the message was created.
 *           example: "2024-06-24T14:30:00.000Z"
 */
export class MessageDTO {
  constructor (message: Message) {
    this.id = message.id
    this.senderId = message.senderId
    this.receiverId = message.receiverId
    this.content = message.content
    this.createdAt = message.createdAt
  }

  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: Date
}