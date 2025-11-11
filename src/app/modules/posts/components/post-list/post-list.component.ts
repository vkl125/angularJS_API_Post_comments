import { Component, OnInit } from '@angular/core';
import { DataService, Comment, Post, PaginationInfo, User } from '../../';
import { UserService } from '../../../shared';
import { CommonModule } from '@angular/common';
import { PostCommentsComponent } from '../post-comments/post-comments.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [CommonModule, PostCommentsComponent]
})
export class PostListComponent implements OnInit {
  postsResponse: { posts: Post[], pagination: PaginationInfo } | null = null;
  loading = false;
  error: string | null = null;
  pagination: PaginationInfo = {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  };
  currentPage = 1;
  postsPerPage = 20;
  currentUser: User | null = null;

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadCurrentUser();
    await this.loadPosts();
  }

  async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = await this.userService.getCurrentUser();
    } catch (error) {
      console.error('Error loading current user:', error);
      this.currentUser = null;
    }
  }

  async loadPosts(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await this.dataService.getPostsWithCommentsAsync(this.currentPage, this.postsPerPage);
      
      // Initialize commentsCollapsed property for each post
      response.posts.forEach((post: Post) => {
        post.commentsCollapsed = true; // Start with comments collapsed
      });
      this.postsResponse = response;
      this.loading = false;
    } catch (error: any) {
      this.error = 'Failed to load posts. Please try again later.';
      this.loading = false;
      console.error('Error loading posts:', error);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= (this.postsResponse?.pagination?.totalPages || 1)) {
      this.currentPage = page;
      this.loadPosts();
    }
  }

  getPageNumbers(): number[] {
    if (!this.postsResponse) return [];

    const totalPages = this.postsResponse?.pagination?.totalPages;
    const currentPage = this.currentPage;
    const pages: number[] = [];

    // Show up to 5 page numbers around current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  hasComments(post: any): boolean {
    return post.comments && post.comments.length > 0;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.postsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.postsResponse) return 0;
    return this.currentPage * this.postsPerPage;
  }

toggleComments(post: Post): void {
    post.commentsCollapsed = !post.commentsCollapsed;
  }

  isCommentsOpen(post: Post): boolean {
    return !post.commentsCollapsed;
  }

  // Method to toggle all comments open or collapsed
  toggleAllComments(): void {
    if (!this.postsResponse) return;
    
    const allCurrentlyOpen = this.postsResponse.posts.every(post => !post.commentsCollapsed);
    
    // If all are open, collapse all; otherwise open all
    this.postsResponse.posts.forEach(post => {
      post.commentsCollapsed = allCurrentlyOpen;
    });
  }

  // Check if all comments are currently open
  areAllCommentsOpen(): boolean {
    if (!this.postsResponse || this.postsResponse.posts.length === 0) return false;
    return this.postsResponse.posts.every(post => !post.commentsCollapsed);
  }

  // Check if any comments are open
  areAnyCommentsOpen(): boolean {
    if (!this.postsResponse || this.postsResponse.posts.length === 0) return false;
    return this.postsResponse.posts.some(post => !post.commentsCollapsed);
  }

  // CRUD Operations
  async addNewPost(): Promise<void> {
    try {
      const canAdd = await this.userService.canAddPost();
      if (!canAdd) {
        alert('You must be logged in to create a post.');
        return;
      }

      const currentUser = await this.userService.getCurrentUser();
      if (!currentUser) {
        alert('You must be logged in to create a post.');
        return;
      }

      const newPost = {
        title: 'New Post Title',
        body: 'New post content...',
        userId: currentUser.id
      };

      const createdPost = await this.dataService.createPostAsync(newPost);
      console.log('Post created:', createdPost);
      await this.loadPosts(); // Reload to show the new post
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  }

  async editPost(post: Post): Promise<void> {
    try {
      const canEdit = await this.userService.canEditPost(post.userId);
      if (!canEdit) {
        alert('You can only edit your own posts.');
        return;
      }

      const updatedPost = {
        ...post,
        title: prompt('Enter new title:', post.title) || post.title,
        body: prompt('Enter new content:', post.body) || post.body
      };

      if (post.id) {
        const result = await this.dataService.updatePostAsync(post.id, updatedPost);
        console.log('Post updated:', result);
        await this.loadPosts(); // Reload to show updated post
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  }

  async deletePost(post: Post): Promise<void> {
    try {
      const canDelete = await this.userService.canDeletePost(post.userId);
      if (!canDelete) {
        alert('You can only delete your own posts.');
        return;
      }

      if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
        if (post.id) {
          await this.dataService.deletePostAsync(post.id);
          console.log('Post deleted:', post.id);
          await this.loadPosts(); // Reload to remove the deleted post
        }
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  }

  // Comment Event Handlers
  async onCommentAdded(comment: Comment): Promise<void> {
    try {
      const createdComment = await this.dataService.createCommentAsync(comment);
      console.log('Comment created:', createdComment);
      await this.loadPosts(); // Reload to show the new comment
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to create comment. Please try again.');
    }
  }

  async onCommentUpdated(comment: Comment): Promise<void> {
    try {
      if (comment.id) {
        const updatedComment = await this.dataService.updateCommentAsync(comment.id, comment);
        console.log('Comment updated:', updatedComment);
        await this.loadPosts(); // Reload to show updated comment
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  }

  async onCommentDeleted(commentId: number): Promise<void> {
    try {
      await this.dataService.deleteCommentAsync(commentId);
      console.log('Comment deleted:', commentId);
      await this.loadPosts(); // Reload to remove the deleted comment
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  // Helper methods for template
  async canEditPost(post: Post): Promise<boolean> {
    return await this.userService.canEditPost(post.userId);
  }

  async canDeletePost(post: Post): Promise<boolean> {
    return await this.userService.canDeletePost(post.userId);
  }

  async isCurrentUserPost(post: Post): Promise<boolean> {
    return await this.userService.isCurrentUserPostOwner(post.userId);
  }

  getCurrentUserName(): string {
    return this.currentUser?.name || 'Guest';
  }
}