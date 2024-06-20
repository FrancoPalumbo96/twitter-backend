import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { HttpException, db } from '@utils'

import { CommentRepository, CommentRepositoryImpl } from '../repository'
import { CommentService, CommentServiceImpl } from '../service'

export const commentRouter = Router()

// Use dependency injection
const service: CommentService = new CommentServiceImpl(new CommentRepositoryImpl(db))

commentRouter.get('/by_user/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const authId = req.params.user_id;

  try {
    const comments = await service.get(userId, authId)
    return res.status(HttpStatus.OK).send(comments)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})

commentRouter.get('/by_post/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const postId = req.params.post_id;
  const { limit, before, after } = req.query as Record<string, string>

  const parsedLimit = parseInt(limit, 10);
  const validLimit = isNaN(parsedLimit) ? 5 : parsedLimit;

  try {
    const comments = await service.getByPostId(userId, postId, {limit: validLimit, before, after})
    return res.status(HttpStatus.OK).send(comments)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})