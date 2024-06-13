export interface AwsService {
  saveProfilePicture: (userId: string, contentType: string) => Promise<{ url: string; key: string }>
  savePostPictures: (userId: string, contentTypes: string, postId: string, quantity: number) => Promise<{ urls: string[]; keys: string[] }>
  getProfileKey: (userId: string) => Promise<string>
  getPostsKeys: (userId: string, postId: string) => Promise<string[]>
}