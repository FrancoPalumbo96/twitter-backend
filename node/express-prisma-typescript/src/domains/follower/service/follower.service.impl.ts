import { FollowerDTO } from "../dto";
import { FollowerRepository } from "../repository";
import { FollowerService } from "./follower.service";
import { ForbiddenException, NotFoundException, ConflictException} from '@utils'
import { validate } from 'class-validator'

export class FollowerServiceImpl implements FollowerService {
    constructor (private readonly repository: FollowerRepository) {}


    async follow (userId: string, followedId: string): Promise<FollowerDTO> {
        //Avoid duplication of follow
        const follow = await this.repository.get(userId, followedId)
        if(follow) 
            throw new ConflictException('Cannot follow a user you already follow')
        
        //Check user exists
        const followedUser = await this.repository.getUserById(followedId)
        if(!followedUser)
            throw new NotFoundException('Followed User')

        return await this.repository.follow(userId, followedId);
    }


    async unfollow (userId: string, followedId: string): Promise<void>{
        const follow = await this.repository.get(userId, followedId)
        if (!follow) throw new NotFoundException('post')
        if (follow.followerId !== userId || follow.followedId !== followedId) throw new ForbiddenException()
        await this.repository.unfollow(userId, followedId)
    }
    
}