import { Injectable } from '@angular/core';
import { Observable, delay as rxjsDelay } from 'rxjs';
import { BaseService } from './base.service';
import { Comment } from '../models/comment.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseService {

  getComments(): Observable<Comment[]> {
    return this.get<Comment[]>('comments').pipe(
      rxjsDelay(50) // Simulate API call
    );
  }

  createComment(comment: Partial<Comment>): Observable<Comment> {
    const commentWithDates = {
      ...comment,
      createdAt: moment.utc().toDate(),
      updatedAt: moment.utc().toDate()
    };

    return this.post<Comment>('comments', commentWithDates).pipe(
      rxjsDelay(100) // Simulate API call
    );
  }

  updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
    const commentWithDates = {
      ...comment,
      updatedAt: moment.utc().toDate()
    };

    return this.put<Comment>(`comments/${id}`, commentWithDates).pipe(
      rxjsDelay(100) // Simulate API call
    );
  }

  deleteComment(id: number): Observable<void> {
    return this.delete<void>(`comments/${id}`).pipe(
      rxjsDelay(100) // Simulate API call
    );
  }
}