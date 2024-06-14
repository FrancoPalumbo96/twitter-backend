import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { ReactionRepository, ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { ReactionDTO } from '../dto'

export const reactionRouter = Router()

// Use dependency injection
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))


reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const postId = req.params.post_id;

  const { type } = req.body

  await service.react(userId, postId, type)

  return res.status(HttpStatus.OK).send()
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const postId = req.params.post_id;

  const { type } = req.body

  await service.unreact(userId, postId, type)

  return res.status(HttpStatus.OK).send()
})