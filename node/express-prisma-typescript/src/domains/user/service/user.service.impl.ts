import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AwsService } from '@domains/aws/service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository, private readonly awsService: AwsService) {}

  async getUser (userId: any): Promise<UserDTO> {
    const user = await this.repository.getById(userId)

    if (!user) throw new NotFoundException('user')

    try{
      const profileKey = await this.awsService.getProfileKey(userId)

      return {...user, profilePicture: profileKey}
    } catch (error) {
      return {...user, profilePicture: undefined}
    }
  }

  //TODO search for profile images
  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }
}
