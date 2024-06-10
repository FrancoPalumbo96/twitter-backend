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

awsRouter.get('/presigned-url', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  try {
    const { url, key } = await service.saveProfilePicture(userId);
    return res.status(HttpStatus.CREATED).json({ url, key });
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error generating pre-signed URL' });
  }
})

// awsRouter.get('/presigned-url', (req: Request, res: Response) => {
//   const key = req.query.key as string;
//   if (!key) {
//     return res.status(400).json({ error: 'Key is required' });
//   }

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//     Expires: 3600,
//   };

//   //TODO move to Service

//   s3.getSignedUrl('putObject', params, (err, url) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error generating pre-signed URL' });
//     }
//     res.json({ url });
//   });
// });

export default awsRouter;