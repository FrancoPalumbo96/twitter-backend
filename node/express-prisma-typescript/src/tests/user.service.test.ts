import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from './data'
import { ValidationException } from '@utils'


describe('User Service', () => {
  const userService: UserService = new UserServiceImpl(new UserRepositoryImpl(prismaMock))

  test('should get a user successfully', async () => {
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

  test('should get a user by prefix successfully', async () => {
    const user = users[0]
    const prefix = 'ju'
    const expectedUserViewDTO = {
      id: user.id,
      name: user.name,
      username: user.username,
      profilePicture: user.profilePicture
    }
    prismaMock.user.findMany.mockResolvedValue([user])
    const foundUsers = await userService.getByUsernamePrefix(user.id, prefix, {limit: 5, skip: 0})

    expect(foundUsers[0]).toEqual(expectedUserViewDTO)
  })

  test('should get empty list when no users by prefix is found', async () => {
    const user = users[0]
    const prefix = 'ju'
    prismaMock.user.findMany.mockResolvedValue([])
    const foundUsers = await userService.getByUsernamePrefix(user.id, prefix, {limit: 5, skip: 0})

    expect(foundUsers.length).toEqual(0)
  })

  test('should not get user that does not exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(userService.getUser('1')).rejects.toThrow('Validation Error')
  })

  test('should delete a user successfully', async () => {
    const user = users[0]

    const deletedUser = {
      id: '1',
      email: 'juan@gmail.com',
      username: 'Juan96',
      name: 'juan',
      password: 'Strong_Password_00',
      privateUser: true,
      profilePicture: 'key_test_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    }
  
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.update.mockResolvedValue(deletedUser);

    expect(await userService.deleteUser(user.id)).toBe(undefined)
  })
})