export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserPermissions {
  canEditPost: (postUserId: number) => boolean;
  canDeletePost: (postUserId: number) => boolean;
  canAddPost: () => boolean;
  canDeleteComment: (commentEmail: string, commentUserId?: number) => boolean;
}