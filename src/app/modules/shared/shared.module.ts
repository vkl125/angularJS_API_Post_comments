import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCommentsComponent } from '../../components/post-comments/post-comments.component';

//for shared components such as ButtonComponent, CheckboxComponent, RadioButtonComponent, DropdownComponent, ModalComponent, etc.
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostCommentsComponent
  ],
  exports: [
    CommonModule,
    PostCommentsComponent
  ]
})
export class SharedModule { }