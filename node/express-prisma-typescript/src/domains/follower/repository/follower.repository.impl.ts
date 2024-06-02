import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './follower.repository';
import { FollowerDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  
  async follow (userId: string, followedId: string): Promise<FollowerDTO> {
    const follow = await this.db.follow.create({
      data: {
        followerId: userId,
        followedId: followedId,
        deletedAt: null
      }
    })
    return new FollowerDTO({...follow, deletedAt: undefined})
  }

  async updateFollow (userId: string, followedId: string): Promise<void> {
    await this.db.follow.updateMany({
      where: {
            followerId: userId,
            followedId: followedId
          },
      data: {
        deletedAt: null
      }
    })
  }

  async unfollow (userId: string, followedId: string):  Promise<void> {
    await this.db.follow.updateMany({
      where: {
            followerId: userId,
            followedId: followedId
          },
      data: {
        deletedAt: new Date()
      }
    })
  }

  async get (userId: string, followedId: string): Promise<FollowerDTO | null> {
    const follow = await this.db.follow.findFirst({
      where: {
        followerId: userId,
        followedId: followedId
      }
    })

    let deleteAt = follow?.deletedAt ?? undefined;

    return (follow != null) ? new FollowerDTO({...follow, deletedAt: deleteAt}) : null
  }

  async getUserById (userId: string): Promise<UserDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserDTO(user) : null
  }
}
