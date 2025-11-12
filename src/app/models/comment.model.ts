export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  userId?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}