import { describe, expect } from '@jest/globals'
import { PostServiceImpl } from '@domains/post/service'
import { prismaMock } from './config'
import { PostRepositoryImpl } from '@domains/post/repository'
import { ReactionType } from '@prisma/client'
import { ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { users, posts, like, retweet } from './data'
import { ReactionDTO } from '@domains/reaction/dto'
import { ConflictException } from '@utils'

describe('Reaction Service', () => {
  const reactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(prismaMock))

  test('should create a like to a post successfully', async () => {
    const post = posts[0]
    const user = users[0]
    prismaMock.post.findUnique.mockResolvedValue(post)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.create.mockResolvedValue(like)
    const reactionResponse = await reactionService.react('1', '1', ReactionType.LIKE)
    const reactionDTO = new ReactionDTO({...like, deletedAt: undefined}) 

    expect(reactionResponse).toEqual(reactionDTO)
  })

  test('should create a retweet to a post successfully', async () => {
    const post = posts[0]
    const user = users[0]
    prismaMock.post.findUnique.mockResolvedValue(post)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.create.mockResolvedValue(retweet)
    const reactionResponse = await reactionService.react('1', '1', ReactionType.RETWEET)
    const reactionDTO = new ReactionDTO({...retweet, deletedAt: undefined}) 

    expect(reactionResponse).toEqual(reactionDTO)
  })

  test('should not like the same post twice', async () => {
    const post = posts[0]
    const user = users[0]
    prismaMock.reaction.findUnique.mockResolvedValue(like)
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)

    await expect(reactionService.react('1', '1', ReactionType.LIKE)).rejects.toThrow(ConflictException)
  })

  test('should not retweet the same post twice', async () => {
    const post = posts[0]
    const user = users[0]
    prismaMock.reaction.findUnique.mockResolvedValue(retweet)
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)

    await expect(reactionService.react('1', '1', ReactionType.RETWEET)).rejects.toThrow(ConflictException)
  })

  test('should not react to an post that does not exist', async () => {  
    prismaMock.post.findUnique.mockResolvedValue(null)
    prismaMock.reaction.update.mockRejectedValue(new Error('Post not found'));
    await expect(reactionService.react('1', '1', ReactionType.LIKE)).rejects.toThrow('Validation Error');
  });

  test('should delete a reaction successfully', async () => {
    const post = posts[0]
    const user = users[0]
    const deletedLike = {
      id: '1',
      userId: '1',
      postId: '1',
      type: ReactionType.LIKE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.findUnique.mockResolvedValue(like)
    prismaMock.reaction.update.mockResolvedValue(deletedLike);

    expect(await reactionService.unreact(user.id, post.id, ReactionType.LIKE)).toBe(undefined)
  })

  test('should throw an error when deleting a reaction that does not exist', async () => {
    const post = posts[0]
    const user = users[0]
    const deletedLike = {
      id: '1',
      userId: '1',
      postId: '1',
      type: ReactionType.LIKE,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.findUnique.mockResolvedValue(null)
    prismaMock.reaction.update.mockResolvedValue(deletedLike);

    await expect(reactionService.unreact(user.id, post.id, ReactionType.LIKE))
      .rejects.toThrow(`Not found. Couldn't find Reaction`);
  })
})