import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post, Comment } from '../../models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  postsResponse: { posts: Post[], totalPages: number, totalCount: number } | null = null;
  loading = false;
  error: string | null = null;
  currentPage = 1;
  postsPerPage = 20;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.postService.getPostsWithComments(this.currentPage, this.postsPerPage)
      .subscribe({
        next: (response) => {
          this.postsResponse = response;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load posts. Please try again later.';
          this.loading = false;
          console.error('Error loading posts:', error);
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= (this.postsResponse?.totalPages || 1)) {
      this.currentPage = page;
      this.loadPosts();
    }
  }

  getPageNumbers(): number[] {
    if (!this.postsResponse) return [];
    
    const totalPages = this.postsResponse.totalPages;
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

  getEndIndex(): number {
    if (!this.postsResponse) return 0;
    return Math.min(this.currentPage * this.postsPerPage, this.postsResponse.totalCount);
  }
}