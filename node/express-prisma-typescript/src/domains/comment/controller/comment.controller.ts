import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { CommentRepository, CommentRepositoryImpl } from '../repository'
import { CommentService, CommentServiceImpl } from '../service'

export const commentRouter = Router()

// Use dependency injection
const service: CommentService = new CommentServiceImpl(new CommentRepositoryImpl(db))

commentRouter.get('/getAll/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const authId = req.params.user_id;

  const comments = await service.get(userId, authId);

  return res.status(HttpStatus.OK).send(comments)
})