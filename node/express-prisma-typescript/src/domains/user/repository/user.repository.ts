import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  updateProfilePicture: (userId: string, key: string) => Promise<void>
  getRecommendedUsersPaginated: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  getByUsernamePrefix: (userId: string, usernamePrefix: string, options: OffsetPagination) => Promise<UserViewDTO[]>
}
