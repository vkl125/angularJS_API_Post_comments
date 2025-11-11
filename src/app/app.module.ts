import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { PostListComponent, PostsModule } from './modules/posts';
import { SharedModule } from './modules/shared';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgbCollapseModule,
    NgbAccordionModule,
    PostsModule,
    SharedModule,
    PostListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }