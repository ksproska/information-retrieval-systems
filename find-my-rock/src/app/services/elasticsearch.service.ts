import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ElasticsearchResponse} from "../models/elasticsearch-response";
import {ElasticsearchResponseParentSector} from "../models/elasticsearch-response-parent-sector";
import {ElasticsearchResponseTypeCounts} from "../models/elasticsearch-response-type-counts";

interface Filter {
  term: Record<string, any>;
}

interface Filters {
  [key: string]: Filter;
}

interface Sorters {
  [key: string]: any[];
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

  private typesDictionary: Filters = {
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

  private sortDictionary: Sorters = {
    'none': [],
    'grade_asc': [{grade: {order: "asc"}}],
    'grade_desc': [{grade: {order: "desc"}}]
  }

  private yds_grades = [
    "3rd", "4th", "Easy 5th", "5.0", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.7+", "5.8", "5.8-", "5.8+",
    "5.9", "5.9-", "5.9+", "5.10", "5.10-", "5.10a", "5.10a/b", "5.10b", "5.10b/c", "5.10c", "5.10c/d", "5.10d",
    "5.10+", "5.11", "5.11-", "5.11a", "5.11a/b", "5.11b", "5.11b/c", "5.11c", "5.11c/d", "5.11d", "5.11+", "5.12",
    "5.12-", "5.12a", "5.12a/b", "5.12b", "5.12b/c", "5.12c", "5.12c/d", "5.12d", "5.12+", "5.13", "5.13-", "5.13a",
    "5.13a/b", "5.13b", "5.13b/c", "5.13c", "5.13c/d", "5.13d", "5.13+", "5.14", "5.14-", "5.14a", "5.14a/b", "5.14b",
    "5.14b/c", "5.14c", "5.14c/d", "5.14d", "5.14+", "5.15", "5.15a", "5.15c/d", "5.15d", "5.15+", "V-easy", "V0", "V0-",
    "V0+", "V0-1", "V1", "V1-", "V1+", "V1-2", "V2", "V2-", "V2+", "V2-3", "V3", "V3-", "V3+", "V3-4", "V4", "V4-", "V4+",
    "V4-5", "V5", "V5-", "V5+", "V5-6", "V6", "V6-", "V6+", "V6-7", "V7", "V7-", "V7+", "V7-8", "V8", "V8-", "V8+", "V8-9",
    "V9", "V9-", "V9+", "V9-10", "V10", "V10-", "V10+", "V10-11", "V11", "V11-", "V11+", "V11-12", "V12", "V12-", "V12+",
    "V12-13", "V13", "V13-", "V13+", "V13-14", "V14", "V14+", "V14-15", "V15", "V16", "V16-", "V17", "V?"
  ]

  getAllTypeNames() {
    return Object.keys(this.typesDictionary);
  }

  getAllGradeNamesInOrderEasiestToHardest() {
    return this.yds_grades;
  }

  getGradesBetweenBounds(lowerBound: string, upperBound: string) {
    const startIndex = this.yds_grades.indexOf(lowerBound);
    const endIndex = this.yds_grades.indexOf(upperBound);

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('One or both bounds are invalid.');
    }

    if (startIndex > endIndex) {
      throw new Error('Lower bound cannot be greater than upper bound.');
    }

    return this.yds_grades.slice(startIndex, endIndex + 1);
  }

  constructor(private readonly http: HttpClient) {}

  searchInAllFieldsWithFilters(
    text: string,
    typeNames: string[] = this.getAllTypeNames(),
    yds_lower_grade: string = "3rd",
    yds_upper_grade: string = "V?",
    pageNumber: number = 1,
    pageSize: number = 10,
    sector: string = "",
    sortName: string = "none"
  ): Observable<ElasticsearchResponse> {
    const headers = this.headers

    let mustConditions: any[] = [
      {query_string: {query: text, default_operator: "AND"}},
      {terms: {"grade_YDS.keyword": this.getGradesBetweenBounds(yds_lower_grade, yds_upper_grade)}}
    ];

    if (sector !== "" && sector !== null) {
      mustConditions.push({term: {"metadata_parent_sector.keyword": sector}});
    }

    const body = {
      query: {
        bool: {
          must: mustConditions,
          should: [...typeNames.map(filterName => this.typesDictionary[filterName])],
          minimum_should_match: 1
        }
      },
      sort: this.sortDictionary[sortName],
      "from": (pageNumber - 1) * pageSize,
      "size": pageSize
    }
    return this.http.post<ElasticsearchResponse>(this.elasticsearchUrl, body, { headers });
  }

  getAllParentSectors(
    text: string,
    typeNames: string[] = this.getAllTypeNames(),
    yds_lower_grade: string = "3rd",
    yds_upper_grade: string = "V?"
  ) {
    const headers = this.headers;

    const body = {
      size: 10000,
      query: {
        bool: {
          must: [
            {query_string: {query: text, default_operator: "AND"}},
            {terms: {"grade_YDS.keyword": this.getGradesBetweenBounds(yds_lower_grade, yds_upper_grade)}}
          ],
          should: [...typeNames.map(filterName => this.typesDictionary[filterName])],
          minimum_should_match: 1
        }
      },
      "_source": ["metadata_parent_sector"]
    };

    return this.http.post<ElasticsearchResponseParentSector>(this.elasticsearchUrl, body, { headers }).pipe(
      map(response => {
        const uniqueSectors = new Set<string>();
        response.hits.hits.forEach(hit => {
          if (hit._source && hit._source.metadata_parent_sector) {
            uniqueSectors.add(hit._source.metadata_parent_sector);
          }
        });
        return Array.from(uniqueSectors);
      })
    );
  }

  getCountsForTypes(
    text: string,
    typeNames: string[] = this.getAllTypeNames(),
    yds_lower_grade: string = "3rd",
    yds_upper_grade: string = "V?",
    sector: string = ""
  ) {
    const headers = this.headers

    let mustConditions: any[] = [
      {query_string: {query: text, default_operator: "AND"}},
      {terms: {"grade_YDS.keyword": this.getGradesBetweenBounds(yds_lower_grade, yds_upper_grade)}}
    ]

    if (sector !== "" && sector !== null) {
      mustConditions.push({term: {"metadata_parent_sector.keyword": sector}})
    }

    const body = {
      size: 0,
      query: {
        bool: {
          must: mustConditions,
          should: [...typeNames.map(filterName => this.typesDictionary[filterName])],
          minimum_should_match: 1
        }
      },
      aggs: {
        boulder: {filter: {term: {type_boulder: true}}},
        tr:      {filter: {term: {type_tr:      true}}},
        sport:   {filter: {term: {type_sport:   true}}},
        trad:    {filter: {term: {type_trad:    true}}},
        aid:     {filter: {term: {type_aid:     true}}},
        ice:     {filter: {term: {type_ice:     true}}},
        mixed:   {filter: {term: {type_mixed:   true}}},
        snow:    {filter: {term: {type_snow:    true}}},
        alpine:  {filter: {term: {type_alpine:  true}}}
      }
    }
    return this.http.post<ElasticsearchResponseTypeCounts>(this.elasticsearchUrl, body, { headers });
  }
}
