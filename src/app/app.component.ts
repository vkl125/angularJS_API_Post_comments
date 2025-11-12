import { Component } from '@angular/core';
import { PostListComponent } from './components/post-list/post-list.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [PostListComponent]
})
export class AppComponent {
}