start-elasticsearch:
	docker compose up -d elasticsearch

create-index:
	curl -X PUT http://localhost:9200/routes

load-data:
	@for file in ./elasticsearch_data/*; do \
  		curl -s -o /dev/null -w "$$file: %{http_code}\n" \
  		-H "Content-Type: application/x-ndjson" \
  		--data-binary @$$file http://localhost:9200/routes/_bulk ; \
	done

run-test-queries:
	bash ./test_queries.sh

stop-and-clear:
	docker compose down
	docker container prune
	docker volume rm information-retrieval-systems_elastic-data
