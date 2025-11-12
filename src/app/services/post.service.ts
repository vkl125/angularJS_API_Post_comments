import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, delay as rxjsDelay, lastValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { CommentService } from './comment.service';
import { Post, PostWithComments } from '../models/post.model';
import { PaginationInfo } from '../models/pagination.model';
import { formatDateForDisplay, getCurrentDateForDisplay } from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private dataService: DataService,
    private commentService: CommentService
  ) {}

  async getPostsWithComments(page: number = 1, limit: number = 20): Promise<{ posts: PostWithComments[], pagination: PaginationInfo }> {
    await rxjsDelay(150); // Simulate API call
    
    const observable = forkJoin({
      postsData: this.dataService.getPosts(page, limit),
      comments: this.commentService.getComments()
    }).pipe(
      map(({ postsData, comments }) => {
        // Ensure comments have proper dates
        const commentsWithDates = comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt ? formatDateForDisplay(comment.createdAt) : getCurrentDateForDisplay(),
          updatedAt: comment.updatedAt ? formatDateForDisplay(comment.updatedAt) : ""
        }));

        const postsWithComments: PostWithComments[] = postsData.data.map(post => ({
          ...post,
          comments: commentsWithDates.filter(comment => comment.postId === post.id)
        }));

        return {
          posts: postsWithComments,
          pagination: postsData.pagination
        };
      })
    );

    return lastValueFrom(observable);
  }
}