import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, lastValueFrom } from 'rxjs';
import { BaseService } from './base.service';
import { Post, PostWithComments, CreatePostRequest, UpdatePostRequest } from '../models/post.model';
import { PaginationInfo, PaginatedResponse } from '../models/pagination.model';
import { delay } from '../helper/helper';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService {

  async getPosts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    await delay(100); // Simulate API call
    
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    const observable = this.http.get<Post[]>(`${this.apiUrl}/posts`, { 
      params, 
      observe: 'response' 
    }).pipe(
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

    return lastValueFrom(observable);
  }

  async createPost(post: CreatePostRequest): Promise<Post> {
    await delay(200); // Simulate API call
    
    const postWithDates = {
      ...post,
      createdAt: moment.utc().toDate(),
      updatedAt: moment.utc().toDate()
    };

    const observable = this.post<Post>('posts', postWithDates);
    return lastValueFrom(observable);
  }

  async updatePost(id: number, post: UpdatePostRequest): Promise<Post> {
    await delay(150); // Simulate API call
    
    const postWithDates = {
      ...post,
      updatedAt: moment.utc().toDate()
    };

    const observable = this.put<Post>(`posts/${id}`, postWithDates);
    return lastValueFrom(observable);
  }

  async deletePost(id: number): Promise<void> {
    await delay(100); // Simulate API call
    
    const observable = this.delete<void>(`posts/${id}`);
    return lastValueFrom(observable);
  }
}