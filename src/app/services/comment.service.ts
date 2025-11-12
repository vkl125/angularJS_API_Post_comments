import { Injectable } from '@angular/core';
import { Observable, delay as rxjsDelay, map } from 'rxjs';
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

  createComment(comment: Partial<Comment>): void {
    const commentWithDates = {
      ...comment,
      createdAt: moment.utc().toISOString(),
      updatedAt: moment.utc().toISOString()
    };

    this.post<Comment>('comments', commentWithDates).subscribe(() => {
    });
  }

  async updateComment(id: number, comment: Partial<Comment>): Promise<void> {
    const commentWithDates = {
      ...comment,
      createdAt: comment.createdAt ? moment(comment.createdAt, "MMMM Do YYYY, h:mm:ss a").utc().toISOString() : "",
      updatedAt: moment.utc().toISOString()
    };
    await this.put<Comment>(`comments/${id}`, commentWithDates).subscribe(() => {
    });
  }

  async deleteComment(id: number): Promise<void> {
    await this.delete<void>(`comments/${id}`).subscribe(() => {
    });
  }
}