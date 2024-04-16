#!/bin/bash

for FILE in "./query_data"/*
do
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    if [ -f "$FILE" ]; then
        filename=$(basename "$FILE")
        elapsed_time=$(time (curl -s -X GET 'localhost:9200/routes/_search?pretty' -H 'Content-Type: application/json' -d "@$FILE" --output "./query_response/$filename") 2>&1)
        real_time=$(echo "$elapsed_time" | grep "real" | tr ',' '.' | awk '{print $NF}')
        echo "$timestamp,$filename,$real_time" >> "test_time_elapsed_for_queries.csv"
    fi
done
