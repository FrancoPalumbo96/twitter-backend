import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from './data'
import { ValidationException } from '@utils'


describe('User Service', () => {
  const userService: UserService = new UserServiceImpl(new UserRepositoryImpl(prismaMock))

  test('should get a user', async () => {
    const user = users[0]
    prismaMock.user.findUnique.mockResolvedValue(user)
    const userViewDTO = await userService.getUser(user.id)

    const expectedUserViewDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture
    }

    expect(userViewDTO).toEqual(expectedUserViewDTO)
  })

  test('should throw error if user does not exist when getting user', async () => {
    const user = users[0]
    prismaMock.user.findUnique.mockResolvedValue(null)

    expect(userService.getUser(user.id)).rejects.toThrow(ValidationException)
  })

  test('should get a user by prefix', async () => {
    const user = users[0]
    const prefix = 'ju'
    const expectedUserViewDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture
    }
    prismaMock.user.findMany.mockResolvedValue([user])
    const foundUsers = await userService.getByUsernamePrefix(user.id, prefix)

    expect(foundUsers[0]).toEqual(expectedUserViewDTO)
  })

  test('empty list when no users by prefix is found', async () => {
    const user = users[0]
    const prefix = 'ju'
    prismaMock.user.findMany.mockResolvedValue([])
    const foundUsers = await userService.getByUsernamePrefix(user.id, prefix)

    expect(foundUsers.length).toEqual(0)
  })

  test('should not get user that does not exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(userService.getUser('1')).rejects.toThrow('Validation Error')
  })

  test('should delete a user that exists', async () => {
    
  })
})