import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, delay as rxjsDelay } from 'rxjs';
import { BaseService } from './base.service';
import { Post, PostWithComments, CreatePostRequest, UpdatePostRequest } from '../models/post.model';
import { PaginationInfo, PaginatedResponse } from '../models/pagination.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService {

  getPosts(page: number = 1, limit: number = 20): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      params, 
      observe: 'response' 
    }).pipe(
      rxjsDelay(100), // Simulate API call
      map(response => {
        let posts = response.body || [];
        const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        
        // Ensure posts have dates, add if missing
        posts = posts.map(post => ({
          ...post,
          createdAt: post.createdAt ? moment(post.createdAt).local().format("MMMM Do YYYY, h:mm:ss a") : moment().local().format("MMMM Do YYYY, h:mm:ss a"),
          updatedAt: post.updatedAt ? moment(post.updatedAt).local().format("MMMM Do YYYY, h:mm:ss a") : ""
        }));
        
        // Sort posts by createdAt date (newest first)
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const pagination: PaginationInfo = {
          currentPage: page,
          pageSize: limit,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        };

        return { data: posts, pagination };
      })
    );
  }

  createPost(post: CreatePostRequest): Observable<Post> {
    const postWithDates = {
      ...post,
      createdAt: moment.utc().toISOString(),
      updatedAt: moment.utc().toISOString()
    };

    return this.post<Post>('posts', postWithDates).pipe(
      rxjsDelay(200) // Simulate API call
    );
  }

  updatePost(id: number, post: UpdatePostRequest): Observable<Post> {
    const postWithDates = {
      ...post,
      updatedAt: moment.utc().toISOString(),
      createdAt: post.createdAt ? moment(post.createdAt, "MMMM Do YYYY, h:mm:ss a").utc().toISOString() : ""
    };
    moment(postWithDates.createdAt)
    return this.put<Post>(`posts/${id}`, postWithDates).pipe(
      rxjsDelay(150) // Simulate API call
    );
  }

  deletePost(id: number): Observable<void> {
    return this.delete<void>(`posts/${id}`).pipe(
      rxjsDelay(100) // Simulate API call
    );
  }
}