import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isCurrentUserPostOwner(postUserId: number): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.id === postUserId : false;
  }

  canEditPost(postUserId: number): boolean {
    return this.isCurrentUserPostOwner(postUserId);
  }

  canDeletePost(postUserId: number): boolean {
    return this.isCurrentUserPostOwner(postUserId);
  }

  canAddPost(): boolean {
    return this.getCurrentUser() !== null;
  }

  canDeleteComment(commentEmail: string, commentUserId?: number): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    // Check by email (current implementation) or by userId if available
    return currentUser.email === commentEmail || (commentUserId ? currentUser.id === commentUserId : false);
  }
}