export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  commentsCollapsed?: boolean;
  comments: Comment[];
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
  userId?: number;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}