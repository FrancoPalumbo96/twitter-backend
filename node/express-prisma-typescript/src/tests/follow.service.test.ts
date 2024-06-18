import { FollowerRepositoryImpl } from "@domains/follower/repository"
import { FollowerServiceImpl } from "@domains/follower/service"
import { prismaMock } from "./config"
import { follows, users } from "./data"
import { FollowerDTO } from "@domains/follower/dto"

describe('Follow Service', () => {
  const followService = new FollowerServiceImpl(new FollowerRepositoryImpl(prismaMock))

  test('should follow another user successfully', async () => {
    const user = users[0]
    const userfollowed = users[1]
    const follow = follows[0]

    const followDTO: FollowerDTO = {
      id: follow.id,
      followedId: follow.followedId,
      followerId: follow.followerId,
      createdAt: follow.createdAt
    }

    prismaMock.follow.findUnique.mockResolvedValue(null)
    prismaMock.user.findUnique.mockResolvedValue(userfollowed)
    prismaMock.follow.create.mockResolvedValue(follow)

    const followerResponse: FollowerDTO = await followService.follow(user.id, userfollowed.id)

    expect(followerResponse).toEqual(followDTO)
  })

  test('should not be able to follow twice', async () => {
    const user = users[0]
    const userfollowed = users[1]
    const follow = follows[0]

    prismaMock.follow.findUnique.mockResolvedValue(follow)
    prismaMock.user.findUnique.mockResolvedValue(userfollowed)
    prismaMock.follow.create.mockResolvedValue(follow)

    await expect(followService.follow(user.id, userfollowed.id)).rejects.toThrow('Conflict')
  })

  test('should be able to mutual follow', async () => {
    const user1 = users[0]
    const user2 = users[1]
    const follow = follows[0]

    const followDTO: FollowerDTO = {
      id: follow.id,
      followedId: follow.followedId,
      followerId: follow.followerId,
      createdAt: follow.createdAt
    }

    prismaMock.follow.findUnique.mockResolvedValue(null)
    prismaMock.user.findUnique.mockResolvedValue(user2)
    prismaMock.follow.create.mockResolvedValue(follow)

    const followerResponse: FollowerDTO = await followService.follow(user1.id, user2.id)

    expect(followerResponse).toEqual(followDTO)

    const follow2 = follows[1]

    const followDTO2: FollowerDTO = {
      id: follow2.id,
      followedId: follow2.followedId,
      followerId: follow2.followerId,
      createdAt: follow2.createdAt
    }

    prismaMock.follow.findUnique.mockResolvedValue(null)
    prismaMock.user.findUnique.mockResolvedValue(user1)
    prismaMock.follow.create.mockResolvedValue(follow2)

    const followerResponse2: FollowerDTO = await followService.follow(user2.id, user1.id)

    expect(followerResponse2).toEqual(followDTO2)
  })

  test('should be able to unfollow a user that is being followed', async () => {
    const user = users[0]
    const userfollowed = users[1]
    const follow = follows[0]

    const deletedFollow = {
      id: '1',
      followerId: '1',
      followedId: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.follow.findUnique.mockResolvedValue(follow)
    prismaMock.user.findUnique.mockResolvedValue(userfollowed)
    prismaMock.follow.update.mockResolvedValue(deletedFollow)
    expect(await followService.unfollow(user.id, userfollowed.id)).toEqual(undefined)
  })

  test('should not be able to unfollow a user that is not being followed', async () => {
    const user = users[0]
    const userfollowed = users[1]
    const follow = follows[0]

    const deletedFollow = {
      id: '1',
      followerId: '1',
      followedId: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.follow.findUnique.mockResolvedValue(null)
    prismaMock.user.findUnique.mockResolvedValue(userfollowed)
    prismaMock.follow.update.mockResolvedValue(deletedFollow)

    await expect(followService.unfollow(user.id, userfollowed.id))
      .rejects.toThrow(`Not found. Couldn't find Follow, cannot unfollow a person you do not follow`)
  })
})