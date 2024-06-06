export class FollowerDTO {
  constructor (post: FollowerDTO) {
    this.id = post.id
    this.followerId = post.followerId
    this.followedId = post.followedId
    this.createdAt = post.createdAt
    this.deletedAt = post.deletedAt;
  }

  id: string
  followerId: string
  followedId: string
  createdAt: Date
  deletedAt?: Date;
}