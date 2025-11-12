import { Injectable } from '@angular/core';
import { Observable, delay as rxjsDelay, map } from 'rxjs';
import { BaseService } from './base.service';
import { Comment } from '../models/comment.model';
import { createCurrentUTCTimestamp, parseDisplayDateToUTC } from '../helper/helper';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseService {

  getComments(): Observable<Comment[]> {
    return this.get<Comment[]>('comments').pipe(
      rxjsDelay(50) // Simulate API call
    );
  }

  createComment(comment: Partial<Comment>): void {
    const commentWithDates = {
      ...comment,
      createdAt: createCurrentUTCTimestamp(),
      updatedAt: createCurrentUTCTimestamp()
    };

    this.post<Comment>('comments', commentWithDates).subscribe(() => {
    });
  }

  updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
    const commentWithDates = {
      ...comment,
      createdAt: comment.createdAt ? parseDisplayDateToUTC(comment.createdAt) : "",
      updatedAt: createCurrentUTCTimestamp()
    };

    return this.put<Comment>(`comments/${id}`, commentWithDates).pipe(
      rxjsDelay(150)
    );
  }

  deleteComment(id: number): Observable<void> {
    return this.delete<void>(`comments/${id}`).pipe(
      rxjsDelay(150)
    );
  }
}