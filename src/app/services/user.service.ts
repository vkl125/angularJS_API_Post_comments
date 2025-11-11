import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize with default user john@example.com
    this.setCurrentUser({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    });
  }

  async setCurrentUser(user: User): Promise<void> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 0));
    this.currentUserSubject.next(user);
  }

  async getCurrentUser(): Promise<User | null> {
    // Convert observable to promise for async/await usage
    return firstValueFrom(this.currentUser$);
  }

  async isCurrentUserPostOwner(postUserId: number): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    return currentUser ? currentUser.id === postUserId : false;
  }

  async canEditPost(postUserId: number): Promise<boolean> {
    return await this.isCurrentUserPostOwner(postUserId);
  }

  async canDeletePost(postUserId: number): Promise<boolean> {
    return await this.isCurrentUserPostOwner(postUserId);
  }

  async canAddPost(): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    return currentUser !== null;
  }

  async canDeleteComment(commentEmail: string, commentUserId?: number): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return false;
    
    // Check by email (current implementation) or by userId if available
    return currentUser.email === commentEmail || (commentUserId ? currentUser.id === commentUserId : false);
  }
}