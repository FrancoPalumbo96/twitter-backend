import { FollowerDTO } from "../dto";
import { FollowerRepository } from "../repository";
import { FollowerService } from "./follower.service";
import { ForbiddenException, NotFoundException, ConflictException} from '@utils'
import { validate } from 'class-validator'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}


  async follow (userId: string, followedId: string): Promise<FollowerDTO> {
    const follow = await this.repository.get(userId, followedId)

    if(follow){
      if(!follow.deletedAt) 
        throw new ConflictException('Cannot follow a user you already follow')

      //Check if user exists
      const followedUser = await this.repository.getUserById(followedId)
      if(!followedUser)
        throw new NotFoundException('Followed User')

      await this.repository.updateFollow(userId, followedId);

      return new FollowerDTO({...follow, deletedAt: undefined}) 
    } else {
      //Check user exists
      const followedUser = await this.repository.getUserById(followedId)
      if(!followedUser)
        throw new NotFoundException('Followed User')

      return await this.repository.follow(userId, followedId);
    }
  }


  async unfollow (userId: string, followedId: string): Promise<void>{
    const follow: FollowerDTO | null = await this.repository.get(userId, followedId)
    if(!follow) 
      throw new NotFoundException('Follow, cannot unfollow a person you do not follow')

    if(follow.followerId !== userId || follow.followedId !== followedId)
      throw new ForbiddenException()

    if(follow.deletedAt)
      throw new ConflictException('Trying to unfollow an unfollowed user')

    await this.repository.unfollow(userId, followedId)
  }
    
}