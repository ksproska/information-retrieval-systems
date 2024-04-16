start-containers:
	docker compose up -d

create-index:
	curl -X PUT http://localhost:9200/routes

load-data:
	for file in ./movie_data/*; do \
  		curl -X POST -H "Content-Type: application/json" -d @$$file http://localhost:9200/movies/_doc ; \
  		curl -X POST -H "Content-Type: application/json" -d @$$file http://localhost:9200/routes/_doc ; \
	done

	done

query-example:
	curl -X GET "localhost:9200/routes/_search?pretty" -H 'Content-Type: application/json' \
	-d' { "query": { "match": { "Overview": "women" } } }'

run-test-queries:
	bash ./test_queries.sh

stop-and-clear:
	docker compose down
	docker container prune
	docker volume rm information-retrieval-systems_elastic-data
