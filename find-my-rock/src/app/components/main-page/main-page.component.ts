import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

  redirectWithSearchContent() {
    if (this.searchQuery) {
      this.router.navigate(['/serp'], {queryParams: {query: this.searchQuery}});
    }
  }
}
