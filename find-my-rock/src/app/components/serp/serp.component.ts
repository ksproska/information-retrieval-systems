import { Component } from '@angular/core';
import {RouterLink, ɵEmptyOutletComponent} from "@angular/router";
import {RouteCardComponent} from "../route-card/route-card.component";
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {ElasticsearchService} from "../../services/elasticsearch.service";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-serp',
  standalone: true,
  imports: [
    RouterLink,
    ɵEmptyOutletComponent,
    RouteCardComponent,
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
  countsForTypesMap: any;
  errorMessage: string | null = null;

  allTypeNames: string[];
  allGradeNamesInOrderEasiestToHardest: string[]
  allParentSectorsForFilters: string[] | undefined

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
    this.elasticsearchService.getAllParentSectors(
      this.query,
      this.typeNames,
      this.ydsLowerGrade,
      this.ydsUpperGrade
    ).subscribe({
        next: (response) => {
          this.allParentSectorsForFilters = response;
        },
        error: (error) => {
          this.errorMessage = 'Search error for parent sectors search: ' + error.message;
        }
      }
    );
    this.elasticsearchService.getCountsForTypes(
      this.query,
      this.typeNames,
      this.ydsLowerGrade,
      this.ydsUpperGrade,
      this.sector
    ).subscribe({
      next: (response) => {
        this.countsForTypesMap = response.aggregations;
      },
      error: (error) => {
        this.errorMessage = 'Search error: ' + error.message;
      }
    });
  }
}
