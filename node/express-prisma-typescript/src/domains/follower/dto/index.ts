// import { IsNotEmpty, IsString } from 'class-validator'

// export class CreateFollowerInputDTO {
//     @IsString()
//     @IsNotEmpty()
//         followedId!: string
// }

export class FollowerDTO {
  constructor (post: FollowerDTO) {
    this.id = post.id
    this.followerId = post.followerId
    this.followedId = post.followedId
    this.createdAt = post.createdAt
  }

  id: string
  followerId: string
  followedId: string
  createdAt: Date
}