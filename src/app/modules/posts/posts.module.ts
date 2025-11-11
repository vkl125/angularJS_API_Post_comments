import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { PostListComponent } from './components/post-list/post-list.component';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbCollapseModule,
    NgbAccordionModule,
    PostListComponent,
    PostCommentsComponent
  ],
  exports: [
    PostListComponent,
    PostCommentsComponent
  ]
})
export class PostsModule { }