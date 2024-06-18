import { ReactionType } from "@prisma/client"

export const users = [
  {
    id: '1',
    email: 'juan@gmail.com',
    username: 'Juan96',
    name: 'juan',
    password: 'Strong_Password_00',
    privateUser: true,
    profilePicture: 'key_test_1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '2',
    email: 'pedro@gmail.com',
    username: 'Pedr0',
    name: 'pedro',
    password: 'Strong_Password_00',
    privateUser: false,
    profilePicture: 'key_test_2',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '3',
    email: 'oscar@gmail.com',
    username: 'Osc4r',
    name: 'oscar',
    password: 'Strong_Password_00',
    privateUser: true,
    profilePicture: 'key_test_3',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date()
  },
  {
    id: '4',
    email: 'mary@gmail.com',
    username: 'mmaryy',
    name: 'mary',
    password: 'Strong_Password_00',
    privateUser: false,
    profilePicture: 'key_test_4',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
]

export const posts = [
  {
    id: '1',
    authorId: '1',
    content: 'post 1',
    images: ['key 1'],
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '2',
    authorId: '1',
    content: 'post 2',
    images: ['key 2'],
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }
]

export const comments = [
  {
    id: '10',
    authorId: '1',
    content: 'comment 1',
    images: ['key 10'],
    parentId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }
]



export const like = {
  id: '1',
  userId: '1',
  postId: '1',
  type: ReactionType.LIKE,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}

export const retweet = {
  id: '1',
  userId: '1',
  postId: '1',
  type: ReactionType.RETWEET,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
}