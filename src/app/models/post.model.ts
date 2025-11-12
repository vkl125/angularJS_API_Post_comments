import { Comment } from './comment.model';
import { User } from './user.model';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  commentsCollapsed?: boolean;
  comments: Comment[];
  user?: User;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}