// export const UserRepositoryMock = jest.fn().mockImplementation(() => ({
//   create: jest.fn(),
//   delete: jest.fn(),
//   updateProfilePicture: jest.fn(),
//   getRecommendedUsersPaginated: jest.fn(),
//   getById: jest.fn(),
//   getByEmailOrUsername: jest.fn(),
//   getByUsernamePrefix: jest.fn()
// }));

export const checkPassword = jest.fn((password: string, hashedPassword: string) => {
  // Mock logic to compare passwords, return true/false or throw error if needed
  return password === hashedPassword; // Example mock implementation, adjust as needed
});