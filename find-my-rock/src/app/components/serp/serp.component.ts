import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { ElasticsearchService } from "../../services/elasticsearch.service";
import { JsonPipe, NgIf } from "@angular/common";

@Component({
  selector: 'app-serp',
  standalone: true,
  imports: [
    FormsModule,
    JsonPipe,
    NgIf
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.css'
})
export class SerpComponent {
  query: string = "";
  selectedSort: string = "none";
  searchResults: any;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private elasticsearchService: ElasticsearchService) {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || "";
      this.updateSearch();
    });
  }

  updateSearch() {
    this.elasticsearchService.searchInAllFieldsWithFilters(this.query, [], '3rd', 'V?', 1, 10, '', this.selectedSort).subscribe({
      next: (response) => {
        this.searchResults = response.hits.hits;
      },
      error: (error) => {
        this.errorMessage = 'Search error: ' + error.message;
      }
    });
  }
}
