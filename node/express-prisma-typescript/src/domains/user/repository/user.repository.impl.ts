import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'
import { ValidationException } from '@utils'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async updateProfilePicture (userId: string, key: string): Promise<void> {
    try {
      await this.db.user.update({
        where: {
          id: userId
        },
        data: {
          profilePicture: key
        }
      })
    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
    }
    
  }

  async delete (userId: any): Promise<void> {
    try{
      await this.db.user.update({
        where: {
          id: userId,
        },
        data: {
          deletedAt: new Date()
        }
      })
    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
    }
  }


  async getById (userId: any): Promise<UserViewDTO | null> {
    try{
      const user = await this.db.user.findUnique({
        where: {
          id: userId
        }
      })

      const userName = user ? (user.name ?? user.username) : '';

      return user ? new UserViewDTO(
        {id: user.id, name: userName, username: user.username, profilePicture: user.profilePicture}
      ) : null

    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
    }
  }

  async getRecommendedUsersPaginated (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    try {
      
      const users = await this.db.user.findMany({
        take: options.limit,
        skip: options.skip, 
        //Get All users that are following userId, exept users with mutual following and the userId user
        where: {
          follows: {
            some: {
              followedId: userId,
              deletedAt: null
            },
          },
          followers: {
            none: {
              followerId: userId,
              deletedAt: null
            }
          },
          NOT: {
            id: userId,
          }
        },
        orderBy: [
          {
            name: 'asc'
          }
        ]
      })
  
      return users.map(user => {
        const userName = user ? (user.name ?? user.username) : '';
        
        return new UserViewDTO({id: user.id, name: userName, username: user.username, profilePicture: user.profilePicture})
      })
    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
    }
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    try {
      const user = await this.db.user.findFirst({
        where: {
          OR: [
            {
              email
            },
            {
              username
            }
          ]
        }
      })
      return user ? new ExtendedUserDTO(user) : null
    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }]) 
    }
  }

  //TODO add pagination
  async getByUsernamePrefix (userId: string, usernamePrefix: string, options: OffsetPagination): Promise<UserViewDTO[]>{
    try {
      const users = await this.db.user.findMany({
        take: options.limit,
        skip: options.skip, 
        where: {
          deletedAt: null, 
          id: { not: userId },
          AND: [
            {
              username: { //Username includes usernamePrefix with case insensitive
                contains: usernamePrefix, 
                mode: 'insensitive'
              }
            },
            {
              OR: [
                { privateUser: false }, //Public User
                {
                  followers: {
                    some: {
                      followerId: userId, //User follows the usernamePrefix
                      deletedAt: null
                    }
                  }
                }
              ]
            },
          ]
        }
      });
  
      return users.map(user => {
        const userName = user ? (user.name ?? user.username) : '';
        
        return new UserViewDTO({id: user.id, name: userName, username: user.username, profilePicture: user.profilePicture})
      })
    } catch (error) {
      throw new ValidationException([{ field: 'userId', message: 'Invalid userId' }])
    }
  }
}
