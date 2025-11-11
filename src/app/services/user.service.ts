import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { saveToLocalStorage, loadFromLocalStorage, removeFromLocalStorage } from '../helper/helper';

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
  private readonly STORAGE_KEY = 'currentUser';

  constructor() {
    this.loadUserFromStorage();
  }

  private async loadUserFromStorage(): Promise<void> {
    try {
      const storedUser = loadFromLocalStorage(this.STORAGE_KEY);
      if (storedUser) {
        this.currentUserSubject.next(storedUser);
      } else {
        // Initialize with default user if no stored user
        this.setCurrentUser({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        });
      }
    } catch (error) {
      console.warn('Failed to load user from localStorage:', error);
      this.clearUserFromStorage();
      // Initialize with default user on error
      this.setCurrentUser({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      });
    }
  }

  private saveUserToStorage(user: User): void {
    try {
      // Only store non-sensitive user data
      const userDataToStore = {
        id: user.id,
        name: user.name,
        email: user.email
        // Don't store sensitive data like tokens, passwords, etc.
      };
      saveToLocalStorage(this.STORAGE_KEY, userDataToStore);
    } catch (error) {
      console.warn('Failed to save user to localStorage:', error);
    }
  }

  private clearUserFromStorage(): void {
    try {
      removeFromLocalStorage(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear user from localStorage:', error);
    }
  }

  async setCurrentUser(user: User): Promise<void> {
    this.currentUserSubject.next(user);
    this.saveUserToStorage(user);
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

  // Additional method to clear user (logout)
  async clearCurrentUser(): Promise<void> {
    this.currentUserSubject.next(null);
    this.clearUserFromStorage();
  }

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    return this.currentUserSubject.value !== null;
  }
}