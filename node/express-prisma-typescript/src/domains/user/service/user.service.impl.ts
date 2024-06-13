import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AwsService } from '@domains/aws/service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository, private readonly awsService: AwsService) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)

    if (!user) throw new NotFoundException('user')

    try{
      const profileKey = await this.awsService.getProfileKey(userId)

      return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: profileKey})
    } catch (error) {
      return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: null})
    }
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    
    const users = await this.repository.getRecommendedUsersPaginated(userId, options)

    const usersWithProfilePictures = await Promise.all(
      users.map(async (user) => {
        try {
          const profileKey = await this.awsService.getProfileKey(user.id)
          return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: profileKey})
        } catch (error) {
          return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: null})
        }
      })
    );

    return usersWithProfilePictures;
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }
}
