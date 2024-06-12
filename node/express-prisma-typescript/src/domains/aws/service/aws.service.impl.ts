import { AwsService } from "./aws.service";
import { NotFoundException, ConflictException, ValidationException, Constants } from '@utils'
import AWS from 'aws-sdk';


export class AwsServiceImpl implements AwsService {
  constructor(private readonly s3: AWS.S3){}

  async saveProfilePicture (userId: string, contentType: string) : Promise<{ url: string; key: string }> {
    const extension = contentType.split('/')[1]
    const key = `profile-images/${userId}/profile.${extension}`
    //const key = `profile-images/${userId}/${Date.now()}.jpg`;

    const params = {
      Bucket: Constants.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600,
      ContentType: contentType,
      //ACL: 'public-read' //The owner gets full control. Anyone can read the object.
    }

    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl('putObject', params, (err, url) => { // Use 'putObject' for upload
        if (err) {
          reject(err)
        }
        resolve({ url, key })
      })
    })
  }

  //TODO
  async savePostPicture (userId: string) : Promise<{ url: string; key: string }> {
    return {url: '', key: ''}
  }
}