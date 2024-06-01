import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { db } from '@utils'

import { FollowerRepository, FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const followed = req.params.user_id;

  await service.follow(userId, followed);
  
  return res.status(HttpStatus.OK).send()
})