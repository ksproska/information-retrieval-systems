import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ElasticsearchResponse} from "../models/elasticsearch-response";

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  private elasticsearchUrl = 'http://localhost:9200/routes/_search';
  constructor(private readonly http: HttpClient) {
  }

  searchInElasticsearch(query: string): Observable<ElasticsearchResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      query: {
        query_string: {
          query: query,
          default_operator: "AND"
        }
      }
    };

    return this.http.post<ElasticsearchResponse>(this.elasticsearchUrl, body, { headers });
  }
}
