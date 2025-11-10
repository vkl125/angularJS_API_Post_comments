export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  commentsCollapsed?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
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