import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Comment, Post, PaginationInfo } from '../../models/post.model';
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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadPosts();
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
}