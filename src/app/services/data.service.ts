import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, throwError } from 'rxjs';
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
}