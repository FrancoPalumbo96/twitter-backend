/**
 * @swagger
 * components:
 *   schemas:
 *     FollowerDTO:
 *       type: object
 *       required:
 *         - id
 *         - followerId
 *         - followedId
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the follower relationship.
 *           example: "12345"
 *         followerId:
 *           type: string
 *           description: ID of the follower user.
 *           example: "67890"
 *         followedId:
 *           type: string
 *           description: ID of the followed user.
 *           example: "54321"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the follower relationship was created.
 *           example: "2024-06-24T14:30:00.000Z"
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Optional. Date and time when the follower relationship was deleted.
 *           example: "2024-06-25T10:00:00.000Z"
 */
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