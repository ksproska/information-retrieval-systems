import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-serp',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.css'
})
export class SerpComponent {
  query: string = "";

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
    });
  }
}
