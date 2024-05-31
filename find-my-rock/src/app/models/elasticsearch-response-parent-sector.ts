export interface ElasticsearchResponseParentSector {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
}

interface Shards {
  total: number;
  successful: number;
  skipped: number;
  failed: number;
}

interface Hits {
  total: Total;
  max_score: number;
  hits: Hit[];
}

interface Total {
  value: number;
  relation: string;
}

interface Hit {
  _index: string;
  _id: string;
  _score: number;
  _ignored?: string[];
  _source: Route;
}

export interface Route {
  metadata_parent_sector: string;
}
