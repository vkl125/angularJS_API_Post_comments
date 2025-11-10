import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Post, Comment, PostsResponse } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getPosts(page: number = 1, limit: number = 20): Observable<PostsResponse> {
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
        const totalPages = Math.ceil(totalCount / limit);
        
        return {
          posts,
          totalCount,
          currentPage: page,
          totalPages
        };
      })
    );
  }

  getCommentsForPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments?postId=${postId}`);
  }

  getPostsWithComments(page: number = 1, limit: number = 20): Observable<PostsResponse> {
    return this.getPosts(page, limit).pipe(
      map(response => {
        // For each post, get its comments
        const postObservables = response.posts.map(post => 
          this.getCommentsForPost(post.id).pipe(
            map(comments => ({
              ...post,
              comments
            }))
          )
        );

        return forkJoin(postObservables).pipe(
          map(postsWithComments => ({
            ...response,
            posts: postsWithComments
          }))
        );
      }),
      // Flatten the nested observable
      map(observable => observable),
      // Use switchMap to handle the nested observable
      switchMap(observable => observable)
    );
  }
}