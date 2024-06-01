import { FollowerDTO } from '../dto'

export interface FollowerService {
  follow: (userId: string, followedId: string) => Promise<FollowerDTO>
  unfollow: (userId: string, followedId: string) => Promise<void>
}