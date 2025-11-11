import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { Comment, Post, PaginationInfo, User } from '../../models/post.model';
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
  postsResponse: { posts: Post[], totalPages: number, pagination: PaginationInfo } | null = null;
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

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPosts();
  }

  loadCurrentUser(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.dataService.getPostsWithComments(this.currentPage, this.postsPerPage)
      .subscribe({
        next: (response: any) => {
          // Initialize commentsCollapsed property for each post
          response.posts.forEach((post: Post) => {
            post.commentsCollapsed = true; // Start with comments collapsed
          });
          this.postsResponse = response;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Failed to load posts. Please try again later.';
          this.loading = false;
          console.error('Error loading posts:', error);
        }
      });
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
    //return Math.min(this.currentPage * this.postsPerPage, this.postsResponse.pagination?.totalItems);
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

    const newPost = {
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

  editPost(post: Post): void {
    if (!this.userService.canEditPost(post.userId)) {
      alert('You can only edit your own posts.');
      return;
    }

    const updatedPost = {
      ...post,
      title: prompt('Enter new title:', post.title) || post.title,
      body: prompt('Enter new content:', post.body) || post.body
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

  deletePost(post: Post): void {
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
  onCommentAdded(comment: Comment): void {
    this.dataService.createComment(comment).subscribe({
      next: (createdComment) => {
        console.log('Comment created:', createdComment);
        this.loadPosts(); // Reload to show the new comment
      },
      error: (error) => {
        console.error('Error creating comment:', error);
        alert('Failed to create comment. Please try again.');
      }
    });
  }

  onCommentUpdated(comment: Comment): void {
    if (comment.id) {
      this.dataService.updateComment(comment.id, comment).subscribe({
        next: (updatedComment) => {
          console.log('Comment updated:', updatedComment);
          this.loadPosts(); // Reload to show updated comment
        },
        error: (error) => {
          console.error('Error updating comment:', error);
          alert('Failed to update comment. Please try again.');
        }
      });
    }
  }

  onCommentDeleted(commentId: number): void {
    this.dataService.deleteComment(commentId).subscribe({
      next: () => {
        console.log('Comment deleted:', commentId);
        this.loadPosts(); // Reload to remove the deleted comment
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    });
  }

  // Helper methods for template
  canEditPost(post: Post): boolean {
    return this.userService.canEditPost(post.userId);
  }

  canDeletePost(post: Post): boolean {
    return this.userService.canDeletePost(post.userId);
  }

  isCurrentUserPost(post: Post): boolean {
    return this.userService.isCurrentUserPostOwner(post.userId);
  }

  getCurrentUserName(): string {
    return this.currentUser?.name || 'Guest';
  }
}