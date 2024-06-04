import { Component } from '@angular/core';
import {RouterLink, ɵEmptyOutletComponent} from "@angular/router";
import {RouteCardComponent} from "../route-card/route-card.component";
import {ActivatedRoute} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {ElasticsearchService} from "../../services/elasticsearch.service";
import {CommonModule, JsonPipe, NgIf} from "@angular/common";
import {MatSliderModule} from "@angular/material/slider";
import {ElasticsearchResponseTypeCounts} from "../../models/elasticsearch-response-type-counts";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@Component({
  selector: 'app-serp',
  standalone: true,
  imports: [
    RouterLink,
    ɵEmptyOutletComponent,
    RouteCardComponent,
    FormsModule,
    JsonPipe,
    NgIf,
    RouterLink,
    MatSliderModule,
    CommonModule,
    MatPaginator
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.css'
})
export class SerpComponent {
  query: string = "";
  typeNames: string[] = this.elasticsearchService.getAllTypeNames();
  ydsLowerGrade: string = "3rd";
  ydsUpperGrade: string = "V?";
  pageNumber: number = 1;
  pageSize: number = 20;
  sector: string = "";
  selectedSort: string = "none";

  searchResults: any;
  countsForTypesMap: any;
  errorMessage: string | null = null;
  gradeValues: any[]
  sliderValue1 = 0;
  sliderValue2 = 2;


  allTypeNames: string[];
  allGradeNamesInOrderEasiestToHardest: string[]
  allParentSectorsForFilters: string[] | undefined
  selectedTypes: any[];


  constructor(private route: ActivatedRoute, private elasticsearchService: ElasticsearchService) {
    this.allTypeNames = elasticsearchService.getAllTypeNames();
    this.allGradeNamesInOrderEasiestToHardest = elasticsearchService.getAllGradeNamesInOrderEasiestToHardest()
    this.gradeValues = this.allGradeNamesInOrderEasiestToHardest;
    this.selectedTypes = Array(this.allTypeNames.length).fill(false);
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || "";
      this.updateSearch();
    });
    this.selectedTypes.fill(true);
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

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.selectedTypes.fill(isChecked);
    this.typeNames = this.allTypeNames.filter((_, index) => this.selectedTypes[index]);
    this.updateSearch()
  }

  onSliderChange1(event: any): void {
    this.sliderValue1 = parseInt((event.target as HTMLInputElement).value);
    this.ydsLowerGrade = this.gradeValues[this.sliderValue1];
    this.updateSearch();
  }

  onSliderChange2(event: any): void {
    this.sliderValue2 = parseInt((event.target as HTMLInputElement).value);
    this.ydsUpperGrade = this.gradeValues[this.sliderValue2];
    this.updateSearch();
  }


  displayWith(value: number): string {
    return this.gradeValues[value].toString();
  }

  onCheckboxChange(): void{
    this.typeNames = this.allTypeNames.filter((_, index) => this.selectedTypes[index]);
    this.updateSearch();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.updateSearch();
  }
}
