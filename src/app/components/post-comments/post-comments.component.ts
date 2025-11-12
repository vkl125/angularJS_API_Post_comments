import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PostCommentsComponent {
  @Input() comments: Comment[] = [];
  @Input() isOpen = false;
  @Input() postId?: number;
  @Output() commentAdded = new EventEmitter<Comment>();
  @Output() commentUpdated = new EventEmitter<Comment>();
  @Output() commentDeleted = new EventEmitter<number>();

  constructor(private userService: UserService) {}

  hasComments(): boolean {
    return this.comments && this.comments.length > 0;
  }

  canDeleteComment(comment: Comment): boolean {
    return this.userService.canDeleteComment(comment.email, comment.userId);
  }

  async addComment(): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    const newComment = {
      postId: this.postId || 0,
      name: prompt('Enter your name:') || currentUser?.name || 'Anonymous',
      email: prompt('Enter your email:') || currentUser?.email || 'anonymous@example.com',
      body: prompt('Enter your comment:') || 'No comment provided',
      userId: currentUser?.id
    };

    this.commentAdded.emit(newComment as Comment);
  }

  async editComment(comment: Comment): Promise<void> {
    if (!this.canDeleteComment(comment)) {
      alert('You can only edit your own comments.');
      return;
    }

    const updatedComment = {
      ...comment,
      name: prompt('Enter new name:', comment.name) || comment.name,
      email: prompt('Enter new email:', comment.email) || comment.email,
      body: prompt('Enter new comment:', comment.body) || comment.body
    };

    this.commentUpdated.emit(updatedComment);
  }

  async deleteComment(comment: Comment): Promise<void> {
    if (!this.canDeleteComment(comment)) {
      alert('You can only delete your own comments.');
      return;
    }

    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentDeleted.emit(comment.id);
    }
  }
}