import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ElasticsearchResponse} from "../models/elasticsearch-response";
import {ElasticsearchResponseParentSector} from "../models/elasticsearch-response-parent-sector";

interface Filter {
  term: Record<string, any>;
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

  searchInAllFieldsWithFilters(text: string, filters: string[], sector: string): Observable<ElasticsearchResponse> {
    const headers = this.headers
    const filterObjects = filters.map(filterName => this.filters[filterName]);
    const sectorFilter = {
      term: {
        "metadata_parent_sector.keyword": sector
      }
    }
    filterObjects.push(sectorFilter)
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

  getAllParentSectors(text: string, filters: string[]) {
    const headers = this.headers
    const filterObjects = filters.map(filterName => this.filters[filterName]);
    const body = {
      size: 10000,
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
      },
      "_source": ["metadata_parent_sector"]
    }
    return new Promise((resolve, reject) => {
      this.http.post<ElasticsearchResponseParentSector>(this.elasticsearchUrl, body, { headers }).subscribe(
        response => {
          const uniqueSectors = new Set();
          response.hits.hits.forEach(hit => {
            if (hit._source.metadata_parent_sector) {
              uniqueSectors.add(hit._source.metadata_parent_sector);
            }
          });
          resolve(Array.from(uniqueSectors));
        }
      );
    });
  }
}
