-include .env-az-verify-access

AZURE_TENANT_ID ?= dummy-tenant-id


help: ## Display help information
	@echo "$(BLUE)GENI JHipster Test Users Management$(NC)"
	@echo ""
	@echo "Available targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' Makefile | sort | cut -d: -f1 | while read target; do \
		desc=$$(grep "^$$target:.*##" Makefile | sed 's/.*##[[:space:]]*//' ); \
		printf "  $(GREEN)%-25s$(NC) %s\n" "$$target" "$$desc"; \
	done
	@echo ""
	

.PHONY: verify-azure-access verify-openid-configuration
verify-openid-config: ## verify open id configuration
	@echo "Verifying OpenID Configuration..."
	curl -s "https://login.microsoftonline.com/$(AZURE_TENANT_ID)/v2.0/.well-known/openid-configuration" | jq .