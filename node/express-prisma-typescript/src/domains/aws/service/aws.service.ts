export interface AwsService {
  saveProfilePicture: (userId: string, contentType: string) => Promise<{ url: string; key: string }>
  savePostPicture: (userId: string) => Promise<{ url: string; key: string }>
}