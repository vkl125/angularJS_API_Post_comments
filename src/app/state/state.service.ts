import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { AppState, initialState } from './app.state';
import { PostWithComments } from '../models/post.model';
import { User } from '../models/user.model';
import { PaginationInfo } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private stateSubject = new BehaviorSubject<AppState>(initialState);
  public state$ = this.stateSubject.asObservable();

  // Selectors
  get posts$(): Observable<PostWithComments[]> {
    return this.state$.pipe(
      map(state => state.posts),
      distinctUntilChanged()
    );
  }

  get pagination$(): Observable<PaginationInfo> {
    return this.state$.pipe(
      map(state => state.pagination),
      distinctUntilChanged()
    );
  }

  get currentUser$(): Observable<User | null> {
    return this.state$.pipe(
      map(state => state.currentUser),
      distinctUntilChanged()
    );
  }

  get loading$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.loading),
      distinctUntilChanged()
    );
  }

  get error$(): Observable<string | null> {
    return this.state$.pipe(
      map(state => state.error),
      distinctUntilChanged()
    );
  }

  get currentPage$(): Observable<number> {
    return this.state$.pipe(
      map(state => state.currentPage),
      distinctUntilChanged()
    );
  }

  get postsPerPage$(): Observable<number> {
    return this.state$.pipe(
      map(state => state.postsPerPage),
      distinctUntilChanged()
    );
  }

  get allCommentsCollapsed$(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.ui.allCommentsCollapsed),
      distinctUntilChanged()
    );
  }

  get selectedPostId$(): Observable<number | null> {
    return this.state$.pipe(
      map(state => state.ui.selectedPostId),
      distinctUntilChanged()
    );
  }

  // Getters for current state
  get currentState(): AppState {
    return this.stateSubject.value;
  }

  // Actions
  setPosts(posts: PostWithComments[]): void {
    this.updateState({ posts });
  }

  setPagination(pagination: PaginationInfo): void {
    this.updateState({ pagination });
  }

  setCurrentUser(user: User | null): void {
    this.updateState({ currentUser: user });
  }

  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  setCurrentPage(page: number): void {
    this.updateState({ currentPage: page });
  }

  setPostsPerPage(postsPerPage: number): void {
    this.updateState({ postsPerPage });
  }

  setAllCommentsCollapsed(collapsed: boolean): void {
    this.updateState({
      ui: {
        ...this.currentState.ui,
        allCommentsCollapsed: collapsed
      }
    });
  }

  setSelectedPostId(postId: number | null): void {
    this.updateState({
      ui: {
        ...this.currentState.ui,
        selectedPostId: postId
      }
    });
  }

  // Post-specific actions
  addPost(post: PostWithComments): void {
    const posts = [post, ...this.currentState.posts];
    this.updateState({ posts });
  }

  updatePost(updatedPost: PostWithComments): void {
    const posts = this.currentState.posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    this.updateState({ posts });
  }

  deletePost(postId: number): void {
    const posts = this.currentState.posts.filter(post => post.id !== postId);
    this.updateState({ posts });
  }

  togglePostComments(postId: number): void {
    const posts = this.currentState.posts.map(post => 
      post.id === postId 
        ? { ...post, commentsCollapsed: !post.commentsCollapsed }
        : post
    );
    this.updateState({ posts });
  }

  toggleAllComments(): void {
    const allCurrentlyOpen = this.currentState.posts.every(post => !post.commentsCollapsed);
    const posts = this.currentState.posts.map(post => ({
      ...post,
      commentsCollapsed: allCurrentlyOpen
    }));
    
    this.updateState({ 
      posts,
      ui: {
        ...this.currentState.ui,
        allCommentsCollapsed: allCurrentlyOpen
      }
    });
  }

  // Helper method to update state
  private updateState(partialState: Partial<AppState>): void {
    const newState = { ...this.currentState, ...partialState };
    this.stateSubject.next(newState);
  }

  // Reset state
  resetState(): void {
    this.stateSubject.next(initialState);
  }
}