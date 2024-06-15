import AWS from 'aws-sdk';
import { AwsService, AwsServiceImpl} from '../service';
import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

export const awsRouter = Router()

const service: AwsService = new AwsServiceImpl(new AWS.S3())

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

awsRouter.post('/presigned_profile_url', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  //const contentType  = req.headers['content-type']
  const { contentType } = req.body

  if (!contentType || (contentType !== 'image/jpeg' && contentType !== 'image/png')) {
    return res.status(400).json({ error: 'Invalid content type' })
  }

  try {
    const { url, key } = await service.saveProfilePicture(userId);
    return res.status(HttpStatus.CREATED).json({ url, key })
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error generating pre-signed URL' })
  }
})


awsRouter.post('/presigned_post_url', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  
  const { quantity, contentType } = req.body

  if (!contentType || (contentType !== 'image/jpeg' && contentType !== 'image/png')) {
    return res.status(400).json({ error: 'Invalid content type' })
  }

  try {
    const postId: string = Date.now().toString()
    const { urls, keys } = await service.savePostPictures(userId, postId , quantity);
    return res.status(HttpStatus.CREATED).json({ urls, keys })
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error generating pre-signed URL' })
  }
})

awsRouter.get('/get', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  try {
    const key = await service.getProfileKey(userId)
    return res.status(HttpStatus.CREATED).json(key)
  } catch (error) {
    return res.status(HttpStatus.CONFLICT).send()
  }
})

awsRouter.get('/get/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id: postId } = req.params

  try {
    const keys = await service.getPostsKeys(userId, postId)
    return res.status(HttpStatus.CREATED).json(keys)

  } catch (error) {
    return res.status(HttpStatus.CONFLICT).send()
  }
})

export default awsRouter