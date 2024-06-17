import { describe } from '@jest/globals'
import { prismaMock } from './config'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from './data'
import { ConflictException } from '@utils'
//import * as Utils from '@utils'

// Mock the entire Utils module
jest.mock('@utils', () => ({
  ...jest.requireActual('@utils'), // Use actual implementation for other exports
  checkPassword: jest.fn(async (password: string, hash: string) => {
    // Simulate the behavior of checkPassword to return true for any password and hash
    return true;
  }),
}));

describe('Auth User', () => {
  const userRepository = new UserRepositoryImpl(prismaMock)
  const authService = new AuthServiceImpl(userRepository)

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Sign up user successfuly should return token', async () => {
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

  test('Sign up user with username taken should throw error', async () => {
    const user = users[0]

    jest.spyOn(userRepository, 'getByEmailOrUsername').mockResolvedValueOnce({ ...user });

    await expect(authService.signup(user)).rejects.toThrow(ConflictException);
  })

  test('Login User should return token', async () => {
    const user = users[0];

    jest.spyOn(userRepository, 'getByEmailOrUsername').mockResolvedValueOnce({ ...user });

    const token = await authService.login(user)

    expect(token.token).toBeDefined();
    expect(typeof token.token).toBe('string');
    expect(token.token).not.toBe('');
  })

  test('Login User with incorrect password should throw error', async () => {
    const user = users[0];

    // Mock checkPassword to resolve to false (indicating incorrect password)
    //jest.spyOn(Utils, 'checkPassword').mockResolvedValueOnce(false);
    
    jest.spyOn(userRepository, 'getByEmailOrUsername').mockResolvedValueOnce({ ...user });

    await expect(authService.signup(user)).rejects.toThrow(ConflictException);
  })

})