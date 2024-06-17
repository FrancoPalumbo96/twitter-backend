import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from './data'


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

  test('should not get user that does not exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    await expect(userService.getUser('1')).rejects.toThrow('Validation Error')
  })
})