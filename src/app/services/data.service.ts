import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, throwError, lastValueFrom } from 'rxjs';
import { Post, Comment, PostWithComments, PaginationInfo } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async getPosts(page: number = 1, limit: number = 20): Promise<{ posts: Post[], pagination: PaginationInfo }> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    const observable = this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
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

    return lastValueFrom(observable);
  }

  async getComments(): Promise<Comment[]> {
    const observable = this.http.get<Comment[]>(`${this.apiUrl}/comments`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to fetch comments'));
      })
    );

    return lastValueFrom(observable);
  }

  async getPostsWithComments(page: number = 1, limit: number = 20): Promise<{ posts: PostWithComments[], pagination: PaginationInfo }> {
    const observable = forkJoin({
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

    return lastValueFrom(observable);
  }

  // CRUD Operations for Posts
  async createPost(post: Partial<Post>): Promise<Post> {
    const observable = this.http.post<Post>(`${this.apiUrl}/posts`, post).pipe(
      catchError(error => {
        console.error('Error creating post:', error);
        return throwError(() => new Error('Failed to create post'));
      })
    );

    return lastValueFrom(observable);
  }

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const observable = this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post).pipe(
      catchError(error => {
        console.error('Error updating post:', error);
        return throwError(() => new Error('Failed to update post'));
      })
    );

    return lastValueFrom(observable);
  }

  async deletePost(id: number): Promise<void> {
    const observable = this.http.delete<void>(`${this.apiUrl}/posts/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting post:', error);
        return throwError(() => new Error('Failed to delete post'));
      })
    );

    return lastValueFrom(observable);
  }

  // CRUD Operations for Comments
  async createComment(comment: Partial<Comment>): Promise<Comment> {
    const observable = this.http.post<Comment>(`${this.apiUrl}/comments`, comment).pipe(
      catchError(error => {
        console.error('Error creating comment:', error);
        return throwError(() => new Error('Failed to create comment'));
      })
    );

    return lastValueFrom(observable);
  }

  async updateComment(id: number, comment: Partial<Comment>): Promise<Comment> {
    const observable = this.http.put<Comment>(`${this.apiUrl}/comments/${id}`, comment).pipe(
      catchError(error => {
        console.error('Error updating comment:', error);
        return throwError(() => new Error('Failed to update comment'));
      })
    );

    return lastValueFrom(observable);
  }

  async deleteComment(id: number): Promise<void> {
    const observable = this.http.delete<void>(`${this.apiUrl}/comments/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting comment:', error);
        return throwError(() => new Error('Failed to delete comment'));
      })
    );

    return lastValueFrom(observable);
  }
}