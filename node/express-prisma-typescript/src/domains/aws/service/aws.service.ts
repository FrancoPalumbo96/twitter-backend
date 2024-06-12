export interface AwsService {
  saveProfilePicture: (userId: string, contentType: string) => Promise<{ url: string; key: string }>
  savePostPictures: (userId: string, contentTypes: string, quantity: number) => Promise<{ urls: string[]; keys: string[] }>
}