import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ElasticsearchResponse} from "../models/elasticsearch-response";

interface Filter {
  term: Record<string, boolean>;
}

interface Filters {
  [key: string]: Filter;
}


@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  private elasticsearchUrl = 'http://localhost:9200/routes/_search';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  private filters: Filters = {
    'boulder': {term: {type_boulder: true}},
    'tr': {term: {type_tr: true}},
    'sport': {term: {type_sport: true}},
    'trad': {term: {type_trad: true}},
    'aid': {term: {type_aid: true}},
    'ice': {term: {type_ice: true}},
    'mixed': {term: {type_mixed: true}},
    'snow': {term: {type_snow: true}},
    'alpine': {term: {type_alpine: true}}
  };

  constructor(private readonly http: HttpClient) {}

  searchInAllFieldsWithFilters(text: string, filters: string[]): Observable<ElasticsearchResponse> {
    const headers = this.headers
    const filterObjects = filters.map(filterName => this.filters[filterName]);
    const body = {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: text,
                default_operator: "AND"
              }
            },
            ...filterObjects
          ]
        }
      }
    }
    return this.http.post<ElasticsearchResponse>(this.elasticsearchUrl, body, { headers });
  }
}
