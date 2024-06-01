#!/bin/bash

echo "elasticsearch docker container starting..."
docker compose -f docker-compose.yaml up -d elasticsearch

echo "creating index..."
sleep 15
until curl -X PUT -s --output /dev/null --fail http://localhost:9200/routes; do
    echo "Trying again..."
    sleep 5
done

echo "index created, proceeding..."
echo "loading data..."

for file in ./elasticsearch_data/*; do
    curl -s -o /dev/null -w "${file}: %{http_code}\n" -H "Content-Type: application/x-ndjson" \
        --data-binary "@${file}" http://localhost:9200/routes/_bulk
done

echo "data loaded"
echo "setup complete"
