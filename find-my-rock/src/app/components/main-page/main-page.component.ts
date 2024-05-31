import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ElasticsearchService} from "../../services/elasticsearch.service";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  constructor(private elasticsearchService: ElasticsearchService) {}
}
