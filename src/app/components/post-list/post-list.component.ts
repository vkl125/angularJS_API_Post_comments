import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { DataService } from '../../services/data.service';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { Comment } from '../../models/comment.model';
import { PostWithComments, CreatePostRequest, UpdatePostRequest } from '../../models/post.model';
import { User } from '../../models/user.model';
import { PaginationInfo } from '../../models/pagination.model';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { parseDisplayDateToUTC } from '../../helper/helper';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PostCommentsComponent]
})
export class PostListComponent implements OnInit {
  postsResponse: { posts: PostWithComments[], pagination: PaginationInfo } | null = null;
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
    private postService: PostService,
    private dataService: DataService,
    private commentService: CommentService,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadCurrentUser();
    await this.loadPosts();
  }

  loadCurrentUser(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  async loadPosts(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.postService.getPostsWithComments(this.currentPage, this.postsPerPage);
      response.posts.forEach((post: PostWithComments) => {
        post.commentsCollapsed = false; // Start with comments collapsed
      });
      this.postsResponse = response;
      this.pagination = response.pagination;
      this.loading = false;
    } catch (error) {
      this.error = 'Failed to load posts. Please try again later.';
      this.loading = false;
      console.error('Error loading posts with comments:', error);
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

  hasComments(post: PostWithComments): boolean {
    return post.comments && post.comments.length > 0;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.postsPerPage + 1;
  }

  getEndIndex(): number {
    if (!this.postsResponse) return 0;
    return this.currentPage * this.postsPerPage;
  }

  toggleComments(post: PostWithComments): void {
    post.commentsCollapsed = !post.commentsCollapsed;
  }

  isCommentsOpen(post: PostWithComments): boolean {
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
  addNewPost(): void {
    if (!this.userService.canAddPost()) {
      alert('You must be logged in to create a post.');
      return;
    }

    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      alert('You must be logged in to create a post.');
      return;
    }

    const newPost: CreatePostRequest = {
      title: 'New Post Title',
      body: 'New post content...',
      userId: currentUser.id
    };

    this.dataService.createPost(newPost).subscribe({
      next: (createdPost) => {
        console.log('Post created:', createdPost);
        this.loadPosts(); // Reload to show the new post
      },
      error: (error) => {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    });
  }

  editPost(post: PostWithComments): void {
    if (!this.userService.canEditPost(post.userId)) {
      alert('You can only edit your own posts.');
      return;
    }

    const updatedPost: UpdatePostRequest = {
      ...post,
      title: prompt('Enter new title:', post.title) || post.title,
      body: prompt('Enter new content:', post.body) || post.body,
      createdAt: post.createdAt
    };

    if (post.id) {
      this.dataService.updatePost(post.id, updatedPost).subscribe({
        next: (result) => {
          console.log('Post updated:', result);
          this.loadPosts(); // Reload to show updated post
        },
        error: (error) => {
          console.error('Error updating post:', error);
          alert('Failed to update post. Please try again.');
        }
      });
    }
  }

  deletePost(post: PostWithComments): void {
    if (!this.userService.canDeletePost(post.userId)) {
      alert('You can only delete your own posts.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      if (post.id) {
        this.dataService.deletePost(post.id).subscribe({
          next: () => {
            console.log('Post deleted:', post.id);
            this.loadPosts(); // Reload to remove the deleted post
          },
          error: (error) => {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
          }
        });
      }
    }
  }

  // Comment Event Handlers
  async onCommentAdded(comment: Comment): Promise<void> {
    try {
      const createdComment = await this.commentService.createComment(comment);
      console.log('Comment created:', createdComment);
      this.loadPosts(); // Reload to show the new comment
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to create comment. Please try again.');
    }
  }

  async onCommentUpdated(comment: Comment): Promise<void> {
    if (comment.id) {
      try {
        const updatedComment = await this.commentService.updateComment(comment.id, comment);
        console.log('Comment updated:', updatedComment);
        this.loadPosts(); // Reload to show updated comment
      } catch (error) {
        console.error('Error updating comment:', error);
        alert('Failed to update comment. Please try again.');
      }
    }
  }

  async onCommentDeleted(commentId: number): Promise<void> {
    try {
      await this.commentService.deleteComment(commentId);
      console.log('Comment deleted:', commentId);
      this.loadPosts(); // Reload to remove the deleted comment
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  // Helper methods for template
  canEditPost(post: PostWithComments): boolean {
    return this.userService.canEditPost(post.userId);
  }

  canDeletePost(post: PostWithComments): boolean {
    return this.userService.canDeletePost(post.userId);
  }

  isCurrentUserPost(post: PostWithComments): boolean {
    return this.userService.isCurrentUserPostOwner(post.userId);
  }

  getCurrentUserName(): string {
    return this.currentUser?.name || 'Guest';
  }
}