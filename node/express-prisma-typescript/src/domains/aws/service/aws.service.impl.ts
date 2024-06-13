import { AwsService } from "./aws.service";
import { NotFoundException, ConflictException, ValidationException, Constants } from '@utils'
import AWS from 'aws-sdk';


export class AwsServiceImpl implements AwsService {
  constructor(private readonly s3: AWS.S3){}

  async saveProfilePicture (userId: string, contentType: string) : Promise<{ url: string; key: string }> {
    const extension = contentType.split('/')[1]
    const key = `profile_images/${userId}/profile.${extension}`

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

  async savePostPictures(userId: string, contentType: string, postId: string, quantity: number): Promise<{ urls: string[]; keys: string[] }> {
    let urls: string[] = []
    let keys: string[] = []

    const extension = contentType.split('/')[1]
  
    for (let i = 0; i < quantity; i++) {
      const key = `post_images/${userId}/${postId}/${i}.${extension}`
  
      const params = {
        Bucket: Constants.S3_BUCKET_NAME,
        Key: key,
        Expires: 3600,
        ContentType: contentType,
        //ACL: 'public-read' // Consider adding ACL if needed
      }
  
      const url = await new Promise<string>((resolve, reject) => {
        this.s3.getSignedUrl('putObject', params, (err, url) => {
          if (err) {
            reject(err)
          }
          resolve(url)
        })
      })
  
      urls.push(url)
      keys.push(key)
    }
  
    return { urls, keys };
  }

  async getProfileKey(userId: string): Promise<string> {
    const prefix = `profile_images/${userId}`

    const params = {
      Bucket: Constants.S3_BUCKET_NAME,
      Prefix: prefix
    }

    try {
      const data = await this.s3.listObjectsV2(params).promise()
      const profileImage = data.Contents?.find(object => object.Key?.startsWith(`${prefix}`))

      if (profileImage && profileImage.Key) {
        return profileImage.Key
      } else {
        throw new Error('Profile image not found')
      }
    } catch (error) {
      throw error
    }
  }

  async getPostsKeys(userId: string, postId: string): Promise<string[]> {
    const prefix = `post_images/${userId}/${postId}`

    const params = {
      Bucket: Constants.S3_BUCKET_NAME,
      Prefix: prefix
    }

    try {
      const data = await this.s3.listObjectsV2(params).promise() 
      
      
      const keys = data.Contents?.map(object => object.Key) || []
    
      // Filter out undefined keys and return the array
      return keys.filter(key => key !== undefined) as string[]
    } catch (error) {
      console.error('Error fetching post image keys:', error)
      throw error
    }
  }
}