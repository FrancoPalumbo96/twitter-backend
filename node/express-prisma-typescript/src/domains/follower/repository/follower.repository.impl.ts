import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './follower.repository';
import { FollowerDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';
import { ValidationException } from '@utils';

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  
  async follow (userId: string, followedId: string): Promise<FollowerDTO> {
    try {
      const follow = await this.db.follow.create({
        data: {
          followerId: userId,
          followedId: followedId,
          deletedAt: null
        }
      })
      return new FollowerDTO({...follow, deletedAt: undefined})
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }

  async updateFollow (userId: string, followedId: string): Promise<void> {
    try {
      await this.db.follow.update({
        where: {
          followerId_followedId: {
            followerId: userId,
            followedId: followedId
          }
        },
        data: {
          deletedAt: null
        }
      })
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }

  async unfollow (userId: string, followedId: string):  Promise<void> {
    try {
      await this.db.follow.update({
        where: {
          followerId_followedId: {
            followerId: userId,
            followedId: followedId
          }
        },
        data: {
          deletedAt: new Date()
        }
      })
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }

  async get (userId: string, followedId: string): Promise<FollowerDTO | null> {
    try {
      const follow = await this.db.follow.findUnique({
        where: {
          followerId_followedId: {
            followerId: userId,
            followedId: followedId
          }
        }
      })

      let deleteAt = follow?.deletedAt ?? undefined;
      return (follow != null) ? new FollowerDTO({...follow, deletedAt: deleteAt}) : null
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }

  async getAllFollowers (userId: string): Promise<FollowerDTO[]> {
    try {
      const follows = await this.db.follow.findMany({
        where: {
          followerId: userId,
          deletedAt: null
        }
      })
  
      // Convert each Follow object to FollowerDTO
      const followsDTOs = follows.map(follow => {
        let deleteAt = follow?.deletedAt ?? undefined;
        return new FollowerDTO({...follow, deletedAt: deleteAt})
      });
  
      return (followsDTOs != null) ? followsDTOs : []
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }

  async getUserById (userId: string): Promise<UserDTO | null> {
    try {
      const user = await this.db.user.findUnique({
        where: {
          id: userId
        }
      })
      return user ? new UserDTO(user) : null
    } catch (error) {
      throw new ValidationException([
        { field: 'followedId', message: 'Invalid followedId' }
      ])
    }
  }
}
