import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'

import 'express-async-errors'

import { HttpException, db } from '@utils'

import { RetweetRepository, RetweetRepositoryImpl } from '../repository'
import { RetweetService, RetweetServiceImpl } from '../service'

export const retweetRouter = Router()

// Use dependency injection
const service: RetweetService = new RetweetServiceImpl(new RetweetRepositoryImpl(db))

retweetRouter.get('/getAll/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const authId = req.params.user_id;

  try {
    const retweets = await service.get(userId, authId)
    return res.status(HttpStatus.OK).send(retweets)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error})
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})