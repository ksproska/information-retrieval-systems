export interface ElasticsearchResponseTypeCounts {
  took: number;
  timed_out: boolean;
  _shards: Shards;
  hits: Hits;
  aggregations: ClimbingCounts;
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
}

interface Total {
  value: number;
  relation: string;
}

export interface ClimbingCounts {
  alpine: number;
  boulder: number;
  aid: number;
  mixed: number;
  trad: number;
  tr: number;
  sport: number;
  ice: number;
  snow: number;
}
