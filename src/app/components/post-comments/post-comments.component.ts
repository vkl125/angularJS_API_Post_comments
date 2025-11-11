import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/post.model';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PostCommentsComponent {
  @Input() comments: Comment[] = [];
  @Input() isOpen = false;
  @Input() postId?: number;

  hasComments(): boolean {
    return this.comments && this.comments.length > 0;
  }
}