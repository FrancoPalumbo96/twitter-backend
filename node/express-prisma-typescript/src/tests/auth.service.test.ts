import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from './data'
import { ConflictException } from '@utils'

describe('Auth User', () => {
  const userRepository = new UserRepositoryImpl(prismaMock)
  const authService = new AuthServiceImpl(userRepository)

  test('Sign up user should have token', async () => {
    const user = users[0]
    prismaMock.user.create.mockResolvedValue(user)
    const token = await authService.signup(user)

    expect(token.token).toBeDefined();
    expect(typeof token.token).toBe('string');
    expect(token.token).not.toBe('');

    prismaMock.user.findUnique.mockResolvedValue(user)
    const createdUser = await prismaMock.user.findUnique({ where: { id: user.id } })
    expect(createdUser).toEqual(user)
  })

  test('Sign up user with username taken should be an error', async () => {
    const user = users[0]
    jest.spyOn(userRepository, 'getByEmailOrUsername').mockResolvedValueOnce({ ...user });

    await expect(authService.signup(user)).rejects.toThrow(ConflictException);
  })
})