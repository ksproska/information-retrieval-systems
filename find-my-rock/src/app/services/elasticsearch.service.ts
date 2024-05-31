import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ElasticsearchResponse} from "../models/elasticsearch-response";

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {
  private elasticsearchUrl = 'http://localhost:9200/routes/_search';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private readonly http: HttpClient) {
  }

  searchInAllFields(text: string): Observable<ElasticsearchResponse> {
    const headers = this.headers
    const body = {
      query: {
        query_string: {
          query: text,
          default_operator: "AND"
        }
      }
    };

    return this.http.post<ElasticsearchResponse>(this.elasticsearchUrl, body, { headers });
  }
}
