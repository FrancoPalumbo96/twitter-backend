import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: string) => Promise<void>
  getUser: (userId: string) => Promise<UserViewDTO>
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  getByUsernamePrefix: (userId: string, usernamePrefix: string) => Promise<UserViewDTO[]>
}
