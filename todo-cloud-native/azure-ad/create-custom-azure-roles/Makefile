# Makefile for setting up custom Azure roles for GENI JHipster

# Load environment variables from .env-az-infra file if it exists
-include .env-az-roles

# Default Variables (will be overridden by .env-az-infra if present)
SUBSCRIPTION_ID ?= dummy-subscription-id
RESOURCE_GROUP ?= dummy-rg
ROLES_DIR ?= azure-roles
ADMIN_ROLE_FILE ?= $(ROLES_DIR)/geni-admin-role.json
SITE_MANAGER_ROLE_FILE ?= $(ROLES_DIR)/geni-site-manager-role.json
OPERATOR_ROLE_FILE ?= $(ROLES_DIR)/geni-operator-role.json
ASSIGNEE?= whoami

# Default target
help: ## Display help information for all available targets
	@echo "Available Makefile targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' Makefile | sort | awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' || echo "Error: No targets with descriptions found. Ensure 'awk' and 'grep' are installed."


.PHONY: check-assignee-assignment 
check-assignee-assignment: ## Check if the assignee has Owner or User Access Administrator role assignment
	@echo "checking access for assignee..."
	@az role assignment list --assignee $(ASSIGNEE) --subscription $(SUBSCRIPTION_ID) -o table
	@echo "Hope you see Owner or User Access Administrator access for assignee..."

# Create custom Azure roles
.PHONY: create-roles
create-roles: ## Create custom Azure roles from definition files
	@echo "🎭 Creating custom Azure roles..."
	@for file in $(ADMIN_ROLE_FILE) $(SITE_MANAGER_ROLE_FILE) $(OPERATOR_ROLE_FILE); do \
		if [ -f "$$file" ]; then \
			echo "🔧 Creating role from $$file..."; \
			az role definition create --role-definition "$$file"; \
			if [ $$? -eq 0 ]; then \
				echo "✅ Successfully created role from $$file"; \
			else \
				echo "❌ Failed to create role from $$file"; \
				exit 1; \
			fi; \
		else \
			echo "❌ Error: Role file $$file not found"; \
			exit 1; \
		fi; \
	done
	@echo "✅ All custom Azure roles created!"

# List custom Azure roles
.PHONY: list-roles
list-roles: ## List custom Azure roles for GENI JHipster
	@echo "📋 Listing custom Azure roles..."
	@az role definition list --custom-role-only true -o table | head -1  # Header
	@az role definition list --custom-role-only true -o table | grep "GENI"

# Delete custom Azure roles
.PHONY: delete-roles
delete-roles: ## Delete custom Azure roles for GENI JHipster
	@echo "🗑️ Deleting custom Azure roles..."
	@for role in "GENI Administrator" "GENI Site Manager" "GENI Operator"; do \
		ROLE_EXISTS=$$(az role definition list --name "$$role" --query '[].name' -o tsv 2>/dev/null); \
		if [ -n "$$ROLE_EXISTS" ]; then \
			echo "🔧 Deleting role $$role..."; \
			az role definition delete --name "$$role"; \
			if [ $$? -eq 0 ]; then \
				echo "✅ Successfully deleted role $$role"; \
			else \
				echo "❌ Failed to delete role $$role"; \
				exit 1; \
			fi; \
		else \
			echo "⚠️ Role $$role not found"; \
		fi; \
	done
	@echo "✅ Completed deleting custom Azure roles"
