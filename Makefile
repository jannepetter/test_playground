TERRACONF := $(shell pwd)/terraform/terrascan_config.toml
IMAGE ?= none

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

scan_with_grype:
	# usage: scan_with_grype IMAGE=<the image>
	-@echo "Scanning with grype"
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $(shell pwd)/grype.yaml:/config/grype.yaml \
	anchore/grype:latest $(IMAGE) -c /config/grype.yaml --only-fixed -f high

trivy_scan:
	# usage: trivy_scan IMAGE=<the image>
	-@echo "Scanning with trivy"
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image $(IMAGE) -q
