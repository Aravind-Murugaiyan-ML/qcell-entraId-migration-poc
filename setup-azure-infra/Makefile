# Makefile for setting up Azure Infrastructure for JHipster GENI

# Load environment variables from .env-az-infra file if it exists
-include .env-az-infra

# Default Variables (will be overridden by .env-az-infra if present)
SUBSCRIPTION_ID ?= dummy-subscription-id
RESOURCE_GROUP ?= dummy-rg
PROD_RESOURCE_GROUP ?= dummy-prod-rg
LOCATION ?= East US
APP_NAME ?= GENI JHipster Gateway
REDIRECT_URIS ?= http://localhost:8080/login/oauth2/code/oidc https://geni-jhipster.azurewebsites.net/login/oauth2/code/oidc
ENV_FILE ?= .env

# Default target
help: ## Display help information for all available targets
	@echo "Available Makefile targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' Makefile | sort | awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' || echo "Error: No targets with descriptions found. Ensure 'awk' and 'grep' are installed."

# Show current configuration
.PHONY: show-config
show-config: ## Display current configuration values
	@echo "🔧 Current Configuration:"
	@echo "========================"
	@echo "SUBSCRIPTION_ID     = $(SUBSCRIPTION_ID)"
	@echo "RESOURCE_GROUP      = $(RESOURCE_GROUP)"
	@echo "PROD_RESOURCE_GROUP = $(PROD_RESOURCE_GROUP)"
	@echo "LOCATION            = $(LOCATION)"
	@echo "APP_NAME            = $(APP_NAME)"
	@echo "REDIRECT_URIS       = $(REDIRECT_URIS)"
	@echo "ENV_FILE            = $(ENV_FILE)"
	@echo ""
	@if [ -f ".env-az-infra" ]; then \
		echo "✅ Configuration loaded from .env-az-infra"; \
	else \
		echo "⚠️  Using default configuration (.env-az-infra not found)"; \
	fi

# Complete setup workflow
.PHONY: all
all: login set-subscription create-resource-groups create-app-registration create-service-principal create-client-secret save-env ## Run complete Azure infrastructure setup

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
	az account set --subscription "$(SUBSCRIPTION_ID)"

# Create resource groups
.PHONY: create-resource-groups
create-resource-groups: set-subscription ## Create development and production resource groups
	@echo "🏗️ Creating resource groups..."
	az group create --name "$(RESOURCE_GROUP)" --location "$(LOCATION)"
	az group create --name "$(PROD_RESOURCE_GROUP)" --location "$(LOCATION)"

# List resource groups 
.PHONY: list-all-resource-groups
list-resource-groups: ## List all resource groups
	@echo "📋 Listing resource groups..."
	az group list --query '[].{Name:name, Location:location}' -o table

# List resource groups given by RESOURCE_GROUP and PROD_RESOURCE_GROUP
.PHONY: list-specific-resource-groups
list-specific-resource-groups: ## List specific resource groups
	@echo "📋 Listing specific resource groups..."
	az group show --name "$(RESOURCE_GROUP)" --query '{Name:name, Location:location}' -o table
	az group show --name "$(PROD_RESOURCE_GROUP)" --query '{Name:name, Location:location}' -o table

# Delete resource groups
.PHONY: delete-specific-resource-groups
delete-resource-groups: ## Delete development and production resource groups
	@echo "Deleting resource groups..."
	az group delete --name "$(RESOURCE_GROUP)" --yes --no-wait
	az group delete --name "$(PROD_RESOURCE_GROUP)" --yes --no-wait

# Create Azure AD App Registration
.PHONY: create-app-registration
create-app-registration: create-resource-groups ## Create Azure AD App Registration with OAuth2 configuration
	@echo "📱 Creating Azure AD App Registration..."
	az ad app create \
		--display-name "$(APP_NAME)" \
		--web-redirect-uris $(REDIRECT_URIS) \
		--required-resource-accesses '[ \
			{ \
				"resourceAppId": "00000003-0000-0000-c000-000000000000", \
				"resourceAccess": [ \
					{ "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d", "type": "Scope" }, \
					{ "id": "06da0dbc-49e2-44d2-8312-53f166ab848a", "type": "Scope" }, \
					{ "id": "7ab1d382-f21e-4acd-a863-ba3e13f7da61", "type": "Role" } \
				] \
			} \
		]'

# List Azure AD App Registration given by APP_NAME
.PHONY: list-app-registration
list-app-registration: ## List Azure AD App Registration given by APP_NAME
	@echo "📋 Listing Azure AD App Registration..."
	az ad app list --display-name "$(APP_NAME)" --query '[].{Name:displayName, AppId:appId}' -o table

# Delete Azure AD App Registration given by APP_NAME
.PHONY: delete-app-registration
delete-app-registration: ## Delete Azure AD App Registration given by APP_NAME
	@echo "🗑️ Deleting Azure AD App Registration..."
	@APP_ID=$$(az ad app list --display-name "$(APP_NAME)" --query '[0].appId' -o tsv 2>/dev/null); \
	if [ -z "$$APP_ID" ]; then \
		echo "❌ Error: No application found with display name '$(APP_NAME)'"; \
		exit 1; \
	else \
		echo "📋 Deleting App Registration with App ID: $$APP_ID"; \
		az ad app delete --id "$$APP_ID"; \
		if [ $$? -eq 0 ]; then \
			echo "✅ Successfully deleted App Registration '$(APP_NAME)'"; \
		else \
			echo "❌ Failed to delete App Registration '$(APP_NAME)'"; \
			exit 1; \
		fi; \
	fi

# Create service principal
.PHONY: create-service-principal
create-service-principal: create-app-registration ## Create service principal for the registered application
	@echo "🔧 Creating service principal..."
	@APP_ID=$$(az ad app list --display-name "$(APP_NAME)" --query '[0].appId' -o tsv); \
	echo "📋 App ID: $$APP_ID"; \
	az ad sp create --id $$APP_ID

# List service principal given by APP_NAME
.PHONY: list-service-principal
list-service-principal: ## List service principal given by APP_NAME
	@echo "📋 Listing service principal for '$(APP_NAME)'..."
	@APP_ID=$$(az ad app list --display-name "$(APP_NAME)" --query '[0].appId' -o tsv 2>/dev/null); \
	if [ -z "$$APP_ID" ]; then \
		echo "❌ Error: No app registration found with display name '$(APP_NAME)'"; \
		exit 1; \
	else \
		SP_LIST=$$(az ad sp list --display-name "$(APP_NAME)" --query '[].{Name:displayName, Id:id}' -o table 2>/dev/null); \
		if [ -z "$$SP_LIST" ]; then \
			echo "⚠️ No service principal found for display name '$(APP_NAME)'"; \
			echo "🔍 Checking for service principal by App ID: $$APP_ID"; \
			az ad sp list --show-mine --query "[?appId=='$$APP_ID'].{Name:displayName, Id:id}" -o table 2>/dev/null || echo "❌ No service principal found for App ID: $$APP_ID"; \
		else \
			echo "$$SP_LIST"; \
		fi; \
	fi

# Delete service principal given by APP_NAME
.PHONY: delete-service-principal
delete-service-principal: ## Delete service principal given by APP_NAME
	@echo "🗑️ Deleting service principal..."
	@SP_ID=$$(az ad sp list --display-name "$(APP_NAME)" --query '[0].id' -o tsv 2>/dev/null); \
	if [ -z "$$SP_ID" ]; then \
		echo "❌ Error: No service principal found with display name '$(APP_NAME)'"; \
		exit 1; \
	else \
		echo "📋 Deleting Service Principal with ID: $$SP_ID"; \
		az ad sp delete --id "$$SP_ID"; \
		if [ $$? -eq 0 ]; then \
			echo "✅ Successfully deleted Service Principal '$(APP_NAME)'"; \
		else \
			echo "❌ Failed to delete Service Principal '$(APP_NAME)'"; \
			exit 1; \
		fi; \
	fi

# Create client secret
.PHONY: create-client-secret
create-client-secret: create-service-principal ## Generate client secret for authentication
	@echo "🔑 Creating client secret..."
	@APP_ID=$$(az ad app list --display-name "$(APP_NAME)" --query '[0].appId' -o tsv); \
	CLIENT_SECRET=$$(az ad app credential reset --id $$APP_ID --append --query password -o tsv); \
	echo "🔑 Client Secret: $$CLIENT_SECRET"; \
	export CLIENT_SECRET=$$CLIENT_SECRET; \
	export APP_ID=$$APP_ID

# Save to environment file
.PHONY: save-env
save-env: create-client-secret ## Save Azure configuration to .env file
	@echo "💾 Saving to environment file..."
	@APP_ID=$$(az ad app list --display-name "$(APP_NAME)" --query '[0].appId' -o tsv); \
	TENANT_ID=$$(az account show --query tenantId -o tsv); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	echo "AZURE_CLIENT_ID=$$APP_ID" > $(ENV_FILE); \
	echo "AZURE_CLIENT_SECRET=$$CLIENT_SECRET" >> $(ENV_FILE); \
	echo "AZURE_TENANT_ID=$$TENANT_ID" >> $(ENV_FILE); \
	echo "AZURE_SUBSCRIPTION_ID=$$SUBSCRIPTION_ID" >> $(ENV_FILE)
	@echo "✅ Azure App Registration completed!"

# Clean up environment file
.PHONY: clean
clean: ## Remove generated environment file
	@echo "🧹 Cleaning up..."
	@rm -f $(ENV_FILE)

# Clean up configuration file
.PHONY: clean-config
clean-config: ## Remove .env-az-infra configuration file
	@echo "🧹 Cleaning up configuration file..."
	@rm -f .env-az-infra
	@echo "✅ Configuration file removed"

# Validate configuration
.PHONY: validate
validate: ## Validate current Azure configuration and display status
	@echo "🔍 Validating Azure configuration..."
	@echo "Current subscription: $$(az account show --query name -o tsv 2>/dev/null || echo 'Not logged in')"
	@echo "Current tenant: $$(az account show --query tenantId -o tsv 2>/dev/null || echo 'Not logged in')"
	@if [ -f "$(ENV_FILE)" ]; then \
		echo "Environment file exists: $(ENV_FILE)"; \
		grep -E "^AZURE_" $(ENV_FILE) | sed 's/=.*/=***/' || true; \
	else \
		echo "Environment file not found: $(ENV_FILE)"; \
	fi

# List all Azure resources in order
.PHONY: list-all
list-all: list-service-principal list-app-registration list-specific-resource-groups ## List service principal, app registration, and resource groups in order
	@echo "✅ Completed listing all Azure resources"

# Delete all Azure resources in order
.PHONY: delete-all
delete-all: delete-service-principal delete-app-registration delete-resource-groups ## Delete service principal, app registration, and resource groups in order
	@echo "✅ Completed deleting all Azure resources"

# Show current status
.PHONY: status
status: ## Show current Azure login and resource status
	@echo "🔍 Current Azure Status:"
	@echo "========================"
	@echo "Login Status: $$(az account show --query user.name -o tsv 2>/dev/null || echo 'Not logged in')"
	@echo "Subscription: $$(az account show --query name -o tsv 2>/dev/null || echo 'None set')"
	@echo "Tenant ID: $$(az account show --query tenantId -o tsv 2>/dev/null || echo 'None')"
	@echo ""
	@echo "Resource Groups:"
	@az group list --query "[?contains(name, 'geni-jhipster')].{Name:name, Location:location, State:properties.provisioningState}" -o table 2>/dev/null || echo "Cannot access resource groups"
	@echo ""
	@echo "App Registration:"
	@az ad app list --display-name "$(APP_NAME)" --query "[].{Name:displayName, AppId:appId}" -o table 2>/dev/null || echo "Cannot access app registrations"