import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, throwError, firstValueFrom } from 'rxjs';
import { Post, Comment, PostWithComments, PaginationInfo } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1, limit: number = 20): Observable<{ posts: Post[], pagination: PaginationInfo }> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      params, 
      observe: 'response' 
    }).pipe(
      map(response => {
        const posts = response.body || [];
        const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        
        const pagination: PaginationInfo = {
          currentPage: page,
          pageSize: limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        };

        return { posts, pagination };
      }),
      catchError(error => {
        console.error('Error fetching posts:', error);
        return throwError(() => new Error('Failed to fetch posts'));
      })
    );
  }

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to fetch comments'));
      })
    );
  }

  getPostsWithComments(page: number = 1, limit: number = 20): Observable<{ posts: PostWithComments[], pagination: PaginationInfo }> {
    return forkJoin({
      postsData: this.getPosts(page, limit),
      comments: this.getComments()
    }).pipe(
      map(({ postsData, comments }) => {
        const postsWithComments: PostWithComments[] = postsData.posts.map(post => ({
          ...post,
          comments: comments.filter(comment => comment.postId === post.id)
        }));

        return {
          posts: postsWithComments,
          pagination: postsData.pagination
        };
      }),
      catchError(error => {
        console.error('Error fetching posts with comments:', error);
        return throwError(() => new Error('Failed to fetch posts with comments'));
      })
    );
  }

  // CRUD Operations for Posts
  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post).pipe(
      catchError(error => {
        console.error('Error creating post:', error);
        return throwError(() => new Error('Failed to create post'));
      })
    );
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post).pipe(
      catchError(error => {
        console.error('Error updating post:', error);
        return throwError(() => new Error('Failed to update post'));
      })
    );
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting post:', error);
        return throwError(() => new Error('Failed to delete post'));
      })
    );
  }

  // CRUD Operations for Comments
  createComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment).pipe(
      catchError(error => {
        console.error('Error creating comment:', error);
        return throwError(() => new Error('Failed to create comment'));
      })
    );
  }

  updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/comments/${id}`, comment).pipe(
      catchError(error => {
        console.error('Error updating comment:', error);
        return throwError(() => new Error('Failed to update comment'));
      })
    );
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting comment:', error);
        return throwError(() => new Error('Failed to delete comment'));
      })
    );
  }

  // Async versions of methods for async/await usage
  async getPostsAsync(page: number = 1, limit: number = 20): Promise<{ posts: Post[], pagination: PaginationInfo }> {
    return firstValueFrom(this.getPosts(page, limit));
  }

  async getCommentsAsync(): Promise<Comment[]> {
    return firstValueFrom(this.getComments());
  }

  async getPostsWithCommentsAsync(page: number = 1, limit: number = 20): Promise<{ posts: PostWithComments[], pagination: PaginationInfo }> {
    return firstValueFrom(this.getPostsWithComments(page, limit));
  }

  async createPostAsync(post: Partial<Post>): Promise<Post> {
    return firstValueFrom(this.createPost(post));
  }

  async updatePostAsync(id: number, post: Partial<Post>): Promise<Post> {
    return firstValueFrom(this.updatePost(id, post));
  }

  async deletePostAsync(id: number): Promise<void> {
    return firstValueFrom(this.deletePost(id));
  }

  async createCommentAsync(comment: Partial<Comment>): Promise<Comment> {
    return firstValueFrom(this.createComment(comment));
  }

  async updateCommentAsync(id: number, comment: Partial<Comment>): Promise<Comment> {
    return firstValueFrom(this.updateComment(id, comment));
  }

  async deleteCommentAsync(id: number): Promise<void> {
    return firstValueFrom(this.deleteComment(id));
  }
}