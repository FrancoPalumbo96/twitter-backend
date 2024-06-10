import { AwsService } from "./aws.service";
import { NotFoundException, ConflictException, ValidationException } from '@utils'
import AWS from 'aws-sdk';

export class AwsServiceImpl implements AwsService {
  constructor(private readonly s3: AWS.S3){}

  async saveProfilePicture (userId: string) : Promise<{ url: string; key: string }> {
    const key = `profile-images/${userId}/${Date.now()}.jpg`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600,
    };

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, url) => { // Use 'putObject' for upload
        if (err) {
          reject(err);
        }
        resolve({ url, key });
      });
    });

    // this.s3.getSignedUrl('putObject', params, (err, url) => {
    //   if (err) {
    //     throw new ConflictException('Error generating pre-signed URL')
    //   }

    //   return 
    //   res.json({ url, key });
    // });
  }

  //TODO
  async savePostPicture (userId: string) : Promise<{ url: string; key: string }> {
    return {url: '', key: ''}
  }
}