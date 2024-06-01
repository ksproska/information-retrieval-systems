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
  typeNames: string[] = [];
  ydsLowerGrade: string = "3rd";
  ydsUpperGrade: string = "V?";
  pageNumber: number = 1;
  pageSize: number = 10;
  sector: string = "";
  selectedSort: string = "none";

  searchResults: any;
  errorMessage: string | null = null;

  allTypeNames: string[];
  allGradeNamesInOrderEasiestToHardest: string[]

  constructor(private route: ActivatedRoute, private elasticsearchService: ElasticsearchService) {
    this.allTypeNames = elasticsearchService.getAllTypeNames();
    this.allGradeNamesInOrderEasiestToHardest = elasticsearchService.getAllGradeNamesInOrderEasiestToHardest()
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || "";
      this.updateSearch();
    });
  }

  updateSearch() {
    this.elasticsearchService.searchInAllFieldsWithFilters(
      this.query,
      this.typeNames,
      this.ydsLowerGrade,
      this.ydsUpperGrade,
      this.pageNumber,
      this.pageSize,
      this.sector,
      this.selectedSort
    ).subscribe({
      next: (response) => {
        this.searchResults = response.hits.hits;
      },
      error: (error) => {
        this.errorMessage = 'Search error: ' + error.message;
      }
    });
  }
}
