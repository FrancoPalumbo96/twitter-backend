import { FollowerDTO } from "../dto"
import { UserDTO } from "@domains/user/dto"

export interface FollowerRepository {
  follow: (userId: string, followedId: string) => Promise<FollowerDTO>
  updateFollow: (userId: string, followedId: string) => Promise<void>
  unfollow: (userId: string, followedId: string) => Promise<void>
  get: (userId: string, followedId: string) => Promise<FollowerDTO | null>
  getUserById: (userId: string) => Promise<UserDTO | null>
}
