export const UserRepositoryMock = jest.fn().mockImplementation(() => ({
  getByEmailOrUsername: jest.fn(),
}));