import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation, HttpException } from '@utils'

import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const parsedLimit = parseInt(limit, 10);
  const validLimit = isNaN(parsedLimit) ? 5 : parsedLimit;

  try {
    const posts = await service.getLatestPosts(userId, { limit: validLimit, before, after })
    return res.status(HttpStatus.OK).json(posts)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})

postRouter.get('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id: postId } = req.params

  try {
    const post = await service.getPost(userId, postId)
    return res.status(HttpStatus.OK).json(post)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})

postRouter.get('/by_user/:user_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { user_id: authorId } = req.params

  try {
    const posts = await service.getPostsByAuthor(userId, authorId)
    return res.status(HttpStatus.OK).json(posts)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  try {
    const post = await service.createPost(userId, data)
    return res.status(HttpStatus.CREATED).json(post)

  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }  
})

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  try {
    await service.deletePost(userId, postId)
    return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
  } catch (error) {
    if (error instanceof HttpException) {
      return res.status(error.code).json({message: error.message, errors: error.error});
    }
    return res.status(HttpStatus.CONFLICT).send()
  }
})
