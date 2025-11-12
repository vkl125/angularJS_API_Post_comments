import { PostWithComments } from '../models/post.model';
import { User } from '../models/user.model';
import { PaginationInfo } from '../models/pagination.model';

export interface AppState {
  posts: PostWithComments[];
  pagination: PaginationInfo;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  postsPerPage: number;
  ui: {
    allCommentsCollapsed: boolean;
    selectedPostId: number | null;
  };
}

export const initialState: AppState = {
  posts: [],
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  },
  currentUser: null,
  loading: false,
  error: null,
  currentPage: 1,
  postsPerPage: 20,
  ui: {
    allCommentsCollapsed: false,
    selectedPostId: null
  }
};