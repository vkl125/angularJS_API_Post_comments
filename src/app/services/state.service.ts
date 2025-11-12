import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {}

  updateUser(user: User | null): void {
    this.userSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isUserLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}