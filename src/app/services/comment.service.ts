import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Comment } from '../models/comment.model';
import { delay } from '../helper/helper';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseService {

  async getComments(): Promise<Comment[]> {
    await delay(50); // Simulate API call
    
    const observable = this.get<Comment[]>('comments');
    return this.lastValueFrom(observable);
  }

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    await delay(100); // Simulate API call
    
    const commentWithDates = {
      ...comment,
      createdAt: moment.utc().toDate(),
      updatedAt: moment.utc().toDate()
    };

    const observable = this.post<Comment>('comments', commentWithDates);
    return this.lastValueFrom(observable);
  }

  async updateComment(id: number, comment: Partial<Comment>): Promise<Comment> {
    await delay(100); // Simulate API call
    
    const commentWithDates = {
      ...comment,
      updatedAt: moment.utc().toDate()
    };

    const observable = this.put<Comment>(`comments/${id}`, commentWithDates);
    return this.lastValueFrom(observable);
  }

  async deleteComment(id: number): Promise<void> {
    await delay(100); // Simulate API call
    
    const observable = this.delete<void>(`comments/${id}`);
    return this.lastValueFrom(observable);
  }

  private async lastValueFrom<T>(observable: any): Promise<T> {
    const { lastValueFrom } = await import('rxjs');
    return lastValueFrom(observable);
  }
}