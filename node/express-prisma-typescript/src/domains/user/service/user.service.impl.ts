import { NotFoundException, ValidationException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { AwsService } from '@domains/aws/service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository, private readonly awsService: AwsService) {}

  async getUser (userId: string): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)

    if (!user) throw new NotFoundException('user')

    try{
      const profileKey = await this.awsService.getProfileKey(userId)

      return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: profileKey})
    } catch (error) {
      return new UserViewDTO({id: user.id, name: user.name, username: user.username, profilePicture: null})
    }
  }

  async getUserRecommendations (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    
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

  async getByUsernamePrefix (userId: string, usernamePrefix: string): Promise<UserViewDTO[]>{
    if(!usernamePrefix || typeof usernamePrefix !== 'string'){
      const errors = [
        { field: 'username', message: 'Username string is required' },
      ];
      throw new ValidationException(errors)
    }

    return await this.repository.getByUsernamePrefix(userId, usernamePrefix)
  }

  async deleteUser (userId: string): Promise<void> {
    return await this.repository.delete(userId)
  }
  
}
