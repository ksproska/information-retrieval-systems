create-network:
	docker network create elastic

run-elastic:
	docker run -d --name elasticsearch \
	--net elastic -p 9200:9200 -p 9300:9300 \
	-e "discovery.type=single-node" -e "xpack.security.enabled=false" \
	elasticsearch:8.12.2

run-kibana:
	docker run -d --name kibana \
	--net elastic -p 5601:5601 \
	-e "xpack.security.enabled=false" \
	kibana:8.12.2

cleanup:
	docker stop elasticsearch kibana
	docker rm elasticsearch kibana
