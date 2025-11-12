import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PostListComponent, PostListModule } from './components/post-list/post-list.component';
import { SharedModule } from './modules/shared/shared.module';
import { PostCommentsModule } from './components/post-comments/post-comments.component';
import { CommentService } from './services';
import { DataService } from './services';
import { UserService } from './services';
import { PostService } from './services';
import { StateService } from './services';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    NgbCollapseModule,
    NgbAccordionModule,
    SharedModule,
    PostListModule,
    PostCommentsModule
  ],
  providers: [
    CommentService,
    DataService,
    UserService,
    PostService,
    StateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }