import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import { PostWithComments } from './models/post.model';
import { PaginationInfo } from './models/pagination.model';
import { PostListComponent } from './components/post-list/post-list.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PostListComponent]
})
export class AppComponent implements OnInit {

  posts: PostWithComments[] = [];
  pagination: PaginationInfo = {
    currentPage: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
  };
  isLoading = false;
  error: string | null = null;
  @ViewChild(PostListComponent) postListComponent: PostListComponent | undefined;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {

  }
  
}