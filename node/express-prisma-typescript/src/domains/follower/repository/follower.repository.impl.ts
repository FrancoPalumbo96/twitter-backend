import { PrismaClient } from '@prisma/client'
import { FollowerRepository } from './follower.repository';
import { FollowerDTO } from '../dto';
import { UserDTO } from '@domains/user/dto';

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}
  
  async follow (userId: string, followedId: string): Promise<FollowerDTO> {
    const follower = await this.db.follow.create({
      data: {
        followerId: userId,
        followedId: followedId
      }
    })
    return new FollowerDTO(follower)
  }

  async unfollow (userId: string, followedId: string):  Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        followerId: userId,
        followedId: followedId
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

    return (follow != null) ? new FollowerDTO(follow) : null
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
