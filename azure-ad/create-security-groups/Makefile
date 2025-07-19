# Makefile for setting up Azure AD security groups for GENI JHipster

# Load environment variables from .env-az-infra file if it exists
-include .env-az-security-groups

# Default Variables (will be overridden by .env-az-infra if present)
SUBSCRIPTION_ID ?= dummy-subscription-id
ENV_FILE = .env
ADMIN_GROUP_NAME ?= GENI-Administrators
MANAGER_GROUP_NAME ?= GENI-Site-Managers
OPERATOR_GROUP_NAME ?= GENI-Operators

# Default target
help: ## Display help information for all available targets
	@echo "Available Makefile targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' Makefile | sort | awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' || echo "Error: No targets with descriptions found. Ensure 'awk' and 'grep' are installed."

# Login to Azure
.PHONY: login
login: ## Login to Azure CLI using device code if no session exists
	@echo "🔧 Checking for active Azure session..."
	@if az account show >/dev/null 2>&1; then \
		echo "✅ Active session found: $$(az account show --query user.name -o tsv)"; \
	else \
		echo "🔐 No active session found, initiating device code login..."; \
		az login --use-device-code; \
		if [ $$? -eq 0 ]; then \
			echo "✅ Successfully logged in: $$(az account show --query user.name -o tsv)"; \
		else \
			echo "❌ Failed to log in to Azure"; \
			exit 1; \
		fi; \
	fi

# Set Azure subscription
.PHONY: set-subscription
set-subscription: login ## Set Azure subscription (requires SUBSCRIPTION_ID)
	@echo "🔧 Setting Azure subscription..."
	@if [ -z "$(SUBSCRIPTION_ID)" ]; then \
		echo "❌ Error: SUBSCRIPTION_ID is not set"; \
		exit 1; \
	fi
	@az account set --subscription "$(SUBSCRIPTION_ID)"; \
	if [ $$? -eq 0 ]; then \
		echo "✅ Subscription set to $(SUBSCRIPTION_ID)"; \
	else \
		echo "❌ Failed to set subscription $(SUBSCRIPTION_ID)"; \
		exit 1; \
	fi

# Create GENI-Administrators security group
.PHONY: create-admin-group
create-admin-group: set-subscription ## Create GENI-Administrators Azure AD security group
	@echo "👥 Creating GENI-Administrators security group..."
	@az ad group create \
		--display-name "$(ADMIN_GROUP_NAME)" \
		--mail-nickname "geni-admins" \
		--description "GENI JHipster Administrators (ROLE_ADMIN)"; \
	if [ $$? -eq 0 ]; then \
		echo "✅ Created security group $(ADMIN_GROUP_NAME)"; \
	else \
		echo "❌ Failed to create security group $(ADMIN_GROUP_NAME)"; \
		exit 1; \
	fi

# Create GENI-Site-Managers security group
.PHONY: create-manager-group
create-manager-group: set-subscription ## Create GENI-Site-Managers Azure AD security group
	@echo "👥 Creating GENI-Site-Managers security group..."
	@az ad group create \
		--display-name "$(MANAGER_GROUP_NAME)" \
		--mail-nickname "geni-site-managers" \
		--description "GENI Site Managers (ROLE_USER + SITE_MANAGER)"; \
	if [ $$? -eq 0 ]; then \
		echo "✅ Created security group $(MANAGER_GROUP_NAME)"; \
	else \
		echo "❌ Failed to create security group $(MANAGER_GROUP_NAME)"; \
		exit 1; \
	fi

# Create GENI-Operators security group
.PHONY: create-operator-group
create-operator-group: set-subscription ## Create GENI-Operators Azure AD security group
	@echo "👥 Creating GENI-Operators security group..."
	@az ad group create \
		--display-name "$(OPERATOR_GROUP_NAME)" \
		--mail-nickname "geni-operators" \
		--description "GENI Operators (ROLE_USER + OPERATOR)"; \
	if [ $$? -eq 0 ]; then \
		echo "✅ Created security group $(OPERATOR_GROUP_NAME)"; \
	else \
		echo "❌ Failed to create security group $(OPERATOR_GROUP_NAME)"; \
		exit 1; \
	fi

# Save security group IDs to environment file
.PHONY: save-group-ids
save-group-ids: create-admin-group create-manager-group create-operator-group ## Save Azure AD security group IDs to .env file
	@echo "💾 Saving security group IDs to $(ENV_FILE)..."
	@ADMIN_GROUP_ID=$$(az ad group show --group "$(ADMIN_GROUP_NAME)" --query id -o tsv 2>/dev/null); \
	if [ -z "$$ADMIN_GROUP_ID" ]; then \
		echo "❌ Error: Failed to retrieve ID for $(ADMIN_GROUP_NAME)"; \
		exit 1; \
	fi; \
	MANAGER_GROUP_ID=$$(az ad group show --group "$(MANAGER_GROUP_NAME)" --query id -o tsv 2>/dev/null); \
	if [ -z "$$MANAGER_GROUP_ID" ]; then \
		echo "❌ Error: Failed to retrieve ID for $(MANAGER_GROUP_NAME)"; \
		exit 1; \
	fi; \
	OPERATOR_GROUP_ID=$$(az ad group show --group "$(OPERATOR_GROUP_NAME)" --query id -o tsv 2>/dev/null); \
	if [ -z "$$OPERATOR_GROUP_ID" ]; then \
		echo "❌ Error: Failed to retrieve ID for $(OPERATOR_GROUP_NAME)"; \
		exit 1; \
	fi; \
	echo "AZURE_ADMIN_GROUP_ID=$$ADMIN_GROUP_ID" >> $(ENV_FILE); \
	echo "AZURE_MANAGER_GROUP_ID=$$MANAGER_GROUP_ID" >> $(ENV_FILE); \
	echo "AZURE_OPERATOR_GROUP_ID=$$OPERATOR_GROUP_ID" >> $(ENV_FILE); \
	if [ $$? -eq 0 ]; then \
		echo "✅ Security group IDs saved to $(ENV_FILE)"; \
	else \
		echo "❌ Failed to save security group IDs to $(ENV_FILE)"; \
		exit 1; \
	fi

# List Azure AD security groups
.PHONY: list-security-groups
list-security-groups: set-subscription ## List Azure AD security groups for GENI JHipster
	@echo "📋 Listing Azure AD security groups..."
	@az ad group list --query "[?contains(displayName, 'GENI')].{Name:displayName, ID:id, Description:description}" -o table || echo "❌ No security groups found or error occurred"

# Delete Azure AD security groups
.PHONY: delete-security-groups
delete-security-groups: set-subscription ## Delete Azure AD security groups for GENI JHipster
	@echo "🗑️ Deleting Azure AD security groups..."
	@for group in "$(ADMIN_GROUP_NAME)" "$(MANAGER_GROUP_NAME)" "$(OPERATOR_GROUP_NAME)"; do \
		GROUP_EXISTS=$$(az ad group show --group "$$group" --query id -o tsv 2>/dev/null); \
		if [ -n "$$GROUP_EXISTS" ]; then \
			echo "🔧 Deleting security group $$group..."; \
			az ad group delete --group "$$group"; \
			if [ $$? -eq 0 ]; then \
				echo "✅ Successfully deleted security group $$group"; \
			else \
				echo "❌ Failed to delete security group $$group"; \
				exit 1; \
			fi; \
		else \
			echo "⚠️ Security group $$group not found"; \
		fi; \
	done
	@echo "✅ Completed deleting Azure AD security groups"

# Clean up environment file entries for security groups
.PHONY: clean-security-groups
clean-security-groups: ## Remove security group IDs from .env file
	@echo "🧹 Cleaning up security group IDs from $(ENV_FILE)..."
	@if [ -f "$(ENV_FILE)" ]; then \
		sed -i.bak '/^AZURE_ADMIN_GROUP_ID=/d; /^AZURE_MANAGER_GROUP_ID=/d; /^AZURE_OPERATOR_GROUP_ID=/d' $(ENV_FILE) && rm -f $(ENV_FILE).bak; \
		if [ $$? -eq 0 ]; then \
			echo "✅ Security group IDs removed from $(ENV_FILE)"; \
		else \
			echo "❌ Failed to clean security group IDs from $(ENV_FILE)"; \
			exit 1; \
		fi; \
	else \
		echo "⚠️ Environment file $(ENV_FILE) not found"; \
	fi

# Complete security group setup workflow
.PHONY: create-all-security-groups
create-all-security-groups: create-admin-group create-manager-group create-operator-group save-group-ids ## Create all Azure AD security groups and save IDs
	@echo "✅ Completed Azure AD security group setup"