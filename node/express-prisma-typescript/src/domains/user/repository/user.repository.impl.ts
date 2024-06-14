import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async updateProfilePicture (userId: string, key: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: key
      }
    })
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }


  async getById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })

    const userName = user ? (user.name ?? user.username) : '';

    
    return user ? new UserViewDTO({id: user.id, name: userName, username: user.username, profilePicture: user.profilePicture}) : null
  }

  async getRecommendedUsersPaginated (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      //Get All users that are following userId, exept users with mutual following and the userId user
      where: {
        follows: {
          some: {
            followed: {
              NOT: {
                follows: {
                  some: {
                    followerId: userId // Users that userId also follows
                  }
                }
              }
            }
          }
        },
        NOT: {
          id: userId
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })

    

    return users.map(user => {
      const userName = user ? (user.name ?? user.username) : '';
      
      return new UserViewDTO({id: user.id, name: userName, username: user.username, profilePicture: user.profilePicture})
    })
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
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
  }

  //TODO add pagination
  async getByUsernamePrefix (userId: string, usernamePrefix: string): Promise<UserViewDTO[]>{
    const users = await this.db.user.findMany({
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
  }
}
