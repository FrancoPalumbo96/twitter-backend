import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { LikeRepository, LikeRepositoryImpl  } from '../repository'
import { LikeService, LikeServiceImpl } from '../service'

export const likeRouter = Router()

// Use dependency injection
const service: LikeService = new LikeServiceImpl(new LikeRepositoryImpl(db))

likeRouter.get('/getAll/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const authId = req.params.user_id;

  const likes = await service.get(userId, authId);

  return res.status(HttpStatus.OK).send(likes)
})