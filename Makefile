start-containers:
	docker compose up -d

create-index:
	curl -X PUT http://localhost:9200/routes

load-data:
	@for file in ./movie_data/*; do \
  		curl -s -X POST -H "Content-Type: application/json" -d @$$file http://localhost:9200/routes/_doc > /dev/null 2>&1 ; \
	done

run-test-queries:
	bash ./test_queries.sh

stop-and-clear:
	docker compose down
	docker container prune
	docker volume rm information-retrieval-systems_elastic-data
