import { NotFoundException, ValidationException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'


export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: string): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)

    if (!user) 
      throw new NotFoundException('user')

    return user
  }

  async getUserRecommendations (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    
    const users = await this.repository.getRecommendedUsersPaginated(userId, options)

    return users
  }

  async getByUsernamePrefix (userId: string, usernamePrefix: string): Promise<UserViewDTO[]>{
    if(!usernamePrefix || typeof usernamePrefix !== 'string'){
      const errors = [
        { field: 'username', message: 'Username string is required' },
      ];
      throw new ValidationException(errors)
    }

    const users = await this.repository.getByUsernamePrefix(userId, usernamePrefix)

    return users
  }

  async updateProfilePicture (userId: string, key: string): Promise<void> {
    return await this.repository.updateProfilePicture(userId, key)
  }

  async deleteUser (userId: string): Promise<void> {
    return await this.repository.delete(userId)
  }
  
}
