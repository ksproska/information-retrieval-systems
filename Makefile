start-containers:
	docker compose up -d

create-index:
	curl -X PUT http://localhost:9200/movies

load-data: create-index
	for file in ./movie_data/*; do \
  		curl -X POST -H "Content-Type: application/json" -d @$$file http://localhost:9200/movies/_doc ; \
	done

query-example:
	curl -X GET "localhost:9200/movies/_search?pretty" -H 'Content-Type: application/json' \
	-d' { "query": { "match": { "Overview": "women" } } }'

run-test-queries:
	bash ./test_queries.sh
