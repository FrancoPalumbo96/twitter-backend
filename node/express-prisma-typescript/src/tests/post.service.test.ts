import { describe, expect } from '@jest/globals'
import { PostServiceImpl } from '@domains/post/service'
import { prismaMock } from './config'
import { PostRepositoryImpl } from '@domains/post/repository'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { users, posts, comments } from './data'


describe('Post Service', () => {
  const postService = new PostServiceImpl(new PostRepositoryImpl(prismaMock))

  test('should create a post successfully', async () => {
    const post = posts[0]
    const postDTO = new PostDTO(post)
    prismaMock.post.create.mockResolvedValue(post)

    const result = await postService.createPost('1', new CreatePostInputDTO())
    expect(result).toEqual(postDTO)
  })

  test('should get posts by author', async () => {
    const post1 = posts[0]
    const post2 = posts[1]
    const user = users[0]
    const dateNow = post1.createdAt

    const extendedPostsDTO = [
      new ExtendedPostDTO({...post1, author: user, qtyComments: 0, qtyLikes: 0, qtyRetweets: 0}),
      new ExtendedPostDTO({...post2, author: user, qtyComments: 0, qtyLikes: 0, qtyRetweets: 0})
    ]

    const repositoryPosts = [
      {
        id: '1',
        authorId: '1',
        content: 'post 1',
        images: ['key 1'],
        parentId: null,
        createdAt: dateNow,
        updatedAt: dateNow,
        deletedAt: null,
        reactions: [],
        _count: {
          reactions: 0,
          comments: 0
        },
        author: user
      },
      {
        id: '2',
        authorId: '1',
        content: 'post 2',
        images: ['key 2'],
        parentId: null,
        createdAt: dateNow,
        updatedAt: dateNow,
        deletedAt: null,
        reactions: [],
        _count: {
          reactions: 0,
          comments: 0
        },
        author: user
      }
    ]

    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.findMany.mockResolvedValue([user])
    prismaMock.post.findMany.mockResolvedValue(repositoryPosts)

    const result = await postService.getPostsByAuthor(user.id, '1')
    expect(result).toEqual(extendedPostsDTO)
  })

  test('should not get a post that does not exist ', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)

    await expect(postService.getPost('1', '1')).rejects.toThrow('Not found. Couldn\'t find post')
  })

  test('should delete a post successfully', async () => {
    const user = users[0]
    const post = posts[0]
    
    const deletedPost = {
      id: '1',
      authorId: '1',
      content: 'post 1',
      images: ['key 1'],
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.post.findFirst.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.post.update.mockResolvedValue(deletedPost);

    expect(await postService.deletePost(user.id, post.id)).toBe(undefined)
  })

  test('should comment on a post successfully', async () => {
    const post = posts[0]
    const user = users[0]
    const comment = comments[0]
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.post.create.mockResolvedValue(comment)
    const commentResponse = await postService.createPost('1', {
      content: 'comment 1',
      images: ['key 10'],
      parentId: '1'
    })

    const commentPostDTO: PostDTO = {
      id: comment.id,
      authorId: comment.authorId,
      content: comment.content,
      images: comment.images,
      parentId: comment.parentId,
      createdAt: comment.createdAt, 
    }

    expect(commentResponse).toEqual(commentPostDTO)
  })

  test('should not comment on a post that does not exist', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)
    const postData = {
      content: 'comment 1',
      images: ['key 10'],
      parentId: '1'
    }

    await expect(postService.createPost('1', postData)).rejects.toThrow('Validation Error')
  })

  test('should delete comment successfully', async () => {
    const user = users[0]
    const comment = comments[0]
    
    const deletedComment = {
      id: '10',
      authorId: '1',
      content: 'comment 1',
      images: ['key 10'],
      parentId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }

    prismaMock.post.findFirst.mockResolvedValue(comment)
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.post.update.mockResolvedValue(deletedComment);

    expect(await postService.deletePost(user.id, comment.id)).toBe(undefined)
  })
})