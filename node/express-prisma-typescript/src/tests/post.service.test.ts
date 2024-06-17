import { describe, expect } from '@jest/globals'
import { PostServiceImpl } from '@domains/post/service'
import { prismaMock } from './config'
import { PostRepositoryImpl } from '@domains/post/repository'
import { CreatePostInputDTO, PostDTO } from '@domains/post/dto'
import { ReactionType } from '@prisma/client'
import { ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { users, posts, like, retweet } from './data'
import { ReactionDTO } from '@domains/reaction/dto'
import { ConflictException } from '@utils'

describe('Post', () => {
  const postService = new PostServiceImpl(new PostRepositoryImpl(prismaMock))
  const reactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(prismaMock))

  test('should create a post successfully', async () => {
    const post = posts[0]
    const postDTO = new PostDTO(post)
    prismaMock.post.create.mockResolvedValue(post)

    const result = await postService.createPost('1', new CreatePostInputDTO())
    expect(result).toEqual(postDTO)
  })

  // test('should get posts by author', async () => {
  //   const post1 = posts[0]
  //   const post2 = posts[1]
  //   const postsByAuthor = [post1, post2]
  //   const user = users[0]
  //   const postsDTO = [
  //     new PostDTO(post1),
  //     new PostDTO(post2)
  //   ]
  //   prismaMock.post.findMany.mockResolvedValue(postsByAuthor)
  //   prismaMock.user.findUnique.mockResolvedValue(user)
  //   prismaMock.user.findMany.mockResolvedValue([user])

  //   const result = await postService.getPostsByAuthor(user.id, '1')
  //   expect(result).toEqual(postsDTO)
  // })

  test('should not get post that do no exist ', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)

    await expect(postService.getPost('1', '1')).rejects.toThrow('Not found. Couldn\'t find post')
  })

  test('should create a like to a post', async () => {
    const post = posts[0]
    const user = users[0]
    prismaMock.post.findUnique.mockResolvedValue(post)

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.reaction.create.mockResolvedValue(like)
    const reactionResponse = await reactionService.react('1', '1', ReactionType.LIKE)
    const reactionDTO = new ReactionDTO({...like, deletedAt: undefined}) 

    expect(reactionResponse).toEqual(reactionDTO)
  })

  test('should create a retweet to a post', async () => {
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

  test('should not react to an non-existent post', async () => {  
    prismaMock.post.findUnique.mockResolvedValue(null)
    prismaMock.reaction.update.mockRejectedValue(new Error('Post not found'));
    await expect(reactionService.react('1', '1', ReactionType.LIKE)).rejects.toThrow('Validation Error');
  });
  

  // test('should comment on a post', async () => {
  //   prismaMock.post.findUnique.mockResolvedValue(post)
  //   prismaMock.user.findUnique.mockResolvedValue(user)
  //   prismaMock.post.create.mockResolvedValue(comment)
  //   const commentResponse = await postService.commentPost('1', '1', 'content')

  //   const commentDTO = {
  //     id: comment.id,
  //     authorId: comment.authorId,
  //     content: comment.content,
  //     images: comment.images,
  //     createdAt: comment.createdAt,
  //     relatedTo: comment.isRelatedTo
  //   }
  //   expect(commentDTO).toEqual(commentResponse)
  // })

  // test('should not comment on a non-existent post', async () => {
  //   prismaMock.post.findUnique.mockResolvedValue(null)
  //   await expect(postService.commentPost('1', '1', 'content')).rejects.toThrow('Not found. Couldn\'t find post')
  // })
})