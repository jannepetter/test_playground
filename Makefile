
terrascan_ci:
	-@echo "Terrascan ci env"
	docker run --rm -v $(shell pwd)/terraform:/project tenable/terrascan scan \
	 -i terraform -t aws -d /project/ci -l error -c /project/terrascan_config.toml --output json

terrascan_prod:
	-@echo "Terrascan production env"
	docker run --rm -v $(shell pwd)/terraform:/project tenable/terrascan scan \
	 -i terraform -t aws -d /project/production -l error -c /project/terrascan_config.toml --output json

tflint:
	-@echo "Running tflint"
	docker run --rm -v $(shell pwd)/terraform:/data ghcr.io/terraform-linters/tflint --recursive

scan_docker:
	-@echo "Scanning docker files with terrascan"
	docker run --rm -v $(shell pwd)/backend:/project tenable/terrascan scan \
	 -i docker -t docker -f /project/Dockerfile -l error --output json
	docker run --rm -v $(shell pwd)/frontend:/project tenable/terrascan scan \
	 -i docker -t docker -f /project/Dockerfile.prod -l error --output json
	docker run --rm -v $(shell pwd)/loadtest/k6/container:/project tenable/terrascan scan \
	 -i docker -t docker -f /project/Dockerfile.k6_slim -l error --output json
