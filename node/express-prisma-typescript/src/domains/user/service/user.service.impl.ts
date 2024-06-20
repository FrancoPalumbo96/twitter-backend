import { ConflictException, HttpException, ValidationException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'


export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: string): Promise<UserViewDTO> {
    try{
      const user = await this.repository.getById(userId)

      if (!user) 
        throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
  
      return user

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching user: ${error}`);
    }
    
  }

  async getUserRecommendations (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    try {
      const users = await this.repository.getRecommendedUsersPaginated(userId, options)
      return users 

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching users: ${error}`);
    }
  }

  async getByUsernamePrefix (userId: string, usernamePrefix: string, options: OffsetPagination): Promise<UserViewDTO[]>{
    try {
      if(!usernamePrefix || typeof usernamePrefix !== 'string'){
        throw new ValidationException([{ field: 'username', message: 'Invalid username prefix' }])
      }
  
      const users = await this.repository.getByUsernamePrefix(userId, usernamePrefix, options)
      return users

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching users: ${error}`);
    }
  }

  async updateProfilePicture (userId: string, key: string): Promise<void> {
    try {
      return await this.repository.updateProfilePicture(userId, key)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching user: ${error}`);
    }
  }

  async deleteUser (userId: string): Promise<void> {
    try {
      await this.repository.delete(userId)
      return
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new ConflictException(`Error fetching user: ${error}`);
    }
  }
}
