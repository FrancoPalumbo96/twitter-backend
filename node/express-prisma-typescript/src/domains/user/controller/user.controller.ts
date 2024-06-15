import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { ValidationException, HttpException , db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

//Returns all public users and private users that follows me
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  try {
    const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })
    return res.status(HttpStatus.OK).json(users)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT)
  }
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const user = await service.getUser(userId)

  try {
    return res.status(HttpStatus.OK).json(user)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT)
  }
})

userRouter.get('/:user_id', async (req: Request, res: Response) => {
  const { user_id: otherUserId } = req.params

  try{
    const user = await service.getUser(otherUserId)
    return res.status(HttpStatus.OK).json(user)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT)
  }
})

userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { username: usernamePrefix} = req.params

  try {
    const users = await service.getByUsernamePrefix(userId, usernamePrefix)
    return res.status(HttpStatus.OK).json(users)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT)
  }
})

userRouter.post('/update_profile_picture', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { key } = req.body

  if (!key) {
    return res.status(HttpStatus.BAD_REQUEST).json({message: 'Validation Error', errors: 'Missing key in request body'});
  }

  try {
    await service.updateProfilePicture(userId, key)
    return res.status(HttpStatus.OK).json({ message: 'Profile picture updated successfully' })

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error updating profile picture' });
  }
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  try {
    await service.deleteUser(userId)
    return res.status(HttpStatus.OK).json()
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT)
  }
})

