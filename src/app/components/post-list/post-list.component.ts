import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { PostWithComments, Comment } from '../../models/post.model';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PostListComponent implements OnInit {
  postsResponse: { posts: PostWithComments[], totalPages: number, totalCount: number } | null = null;
  loading = false;
  error: string | null = null;
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
          response.posts.forEach((post: PostWithComments) => {
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

  toggleComments(post: PostWithComments): void {
    post.commentsCollapsed = !post.commentsCollapsed;
  }

  isCommentsOpen(post: PostWithComments): boolean {
    return !post.commentsCollapsed;
  }
}