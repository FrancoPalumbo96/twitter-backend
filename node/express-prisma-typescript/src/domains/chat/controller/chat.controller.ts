import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { HttpException, db } from '@utils'

import { ChatRepository, ChatRepositoryImpl } from '../repository'
import { ChatService, ChatServiceImpl } from '../service'

export const chatRoute = Router()

// Use dependency injection
const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

chatRoute.get('/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { user_id: receiverId} = req.params

  try {
    const messages = await service.getMessages(userId, receiverId)
    return res.status(HttpStatus.OK).json(messages)
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})