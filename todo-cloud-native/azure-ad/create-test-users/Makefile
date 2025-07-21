# Makefile for GENI JHipster setup using existing Azure AD users

# Variables
AZURE_DOMAIN = xoriant.onmicrosoft.com
RESOURCE_GROUP = geni-jhipster-rg
SUBSCRIPTION_ID = cdaddc8f-3ad6-4b69-ae98-bfeae5609265

# Use existing users (modify these to actual existing users)
ADMIN_UPN = murugaiyan_a@xoriant.com
MANAGER_UPN = murugaiyan_a@xoriant.com  # Same user with different role
OPERATOR_UPN = murugaiyan_a@xoriant.com  # Same user with different role

GENI_ADMIN_ROLE ?= GENI Administrator
GENI_MANAGER_ROLE ?= GENI Site Manager
GENI_OPERATOR_ROLE ?= GENI Operator

# Security Groups
ADMIN_GROUP = GENI-Administrators
MANAGER_GROUP = GENI-Site-Managers
OPERATOR_GROUP = GENI-Operators

# Custom Roles (if they exist)
ADMIN_ROLE = Contributor
MANAGER_ROLE = Reader
OPERATOR_ROLE = Reader

# Colors
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m

.PHONY: help
help: ## Display help information
	@echo "$(BLUE)GENI JHipster Setup - Existing Users$(NC)"
	@echo ""
	@echo "This Makefile works with existing users instead of creating new ones"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*##"}; {printf "  $(GREEN)%-25s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Current Configuration:$(NC)"
	@echo "  Admin User: $(ADMIN_UPN)"
	@echo "  Manager User: $(MANAGER_UPN)"
	@echo "  Operator User: $(OPERATOR_UPN)"

.PHONY: check-login
check-login: ## Check Azure CLI login
	@echo "$(BLUE)🔧 Checking Azure CLI session...$(NC)"
	@if az account show >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Logged in as: $$(az account show --query user.name -o tsv)$(NC)"; \
	else \
		echo "$(RED)❌ Not logged in to Azure CLI$(NC)"; \
		exit 1; \
	fi

.PHONY: set-subscription
set-subscription: check-login ## Set Azure subscription
	@az account set --subscription "$(SUBSCRIPTION_ID)"
	@echo "$(GREEN)✅ Subscription set$(NC)"

.PHONY: list-existing-users
list-existing-users: set-subscription ## List existing users you can use
	@echo "$(BLUE)📋 Available users in your domain:$(NC)"
	@az ad user list --query "[?contains(userPrincipalName,'@$(AZURE_DOMAIN)')].{Name:displayName, UPN:userPrincipalName, Department:department}" -o table

.PHONY: check-user-permissions
check-user-permissions: set-subscription ## Check current user's permissions
	@echo "$(BLUE)🔍 Checking your current permissions...$(NC)"
	@echo "Azure AD roles:"
	@az rest --method GET --url "https://graph.microsoft.com/v1.0/me/memberOf" --query "value[?contains(@odata.type,'Role')].displayName" -o table 2>/dev/null || echo "$(YELLOW)⚠️  Cannot retrieve Azure AD roles$(NC)"
	@echo ""
	@echo "Azure subscription roles:"
	@az role assignment list --assignee $(ADMIN_UPN) --query "[].{Role:roleDefinitionName, Scope:scope}" -o table

# Target to unassign GENI role assignments
.PHONY: unassign-geni-roles
unassign-geni-roles: ## Remove all GENI role assignments from current user
	@echo "$(BLUE)🎭 Attempting to unassign GENI roles...$(NC)"
	@USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	if [ -n "$$USER_ID" ]; then \
		SCOPE="/subscriptions/$$SUBSCRIPTION_ID"; \
		echo "$(BLUE)👤 User: $(ADMIN_UPN) ($$USER_ID)$(NC)"; \
		echo "$(BLUE)📋 Subscription: $$SUBSCRIPTION_ID$(NC)"; \
		echo "$(BLUE)🎯 Scope: $$SCOPE$(NC)"; \
		echo ""; \
		for role in "$(GENI_ADMIN_ROLE)" "$(GENI_MANAGER_ROLE)" "$(GENI_OPERATOR_ROLE)"; do \
			echo "Removing role assignment: $$role..."; \
			EXISTING_ASSIGNMENT=$$(az role assignment list --assignee "$$USER_ID" --role "$$role" --subscription "$$SUBSCRIPTION_ID" --query '[0].id' -o tsv 2>/dev/null); \
			if [ -n "$$EXISTING_ASSIGNMENT" ]; then \
				az role assignment delete --assignee "$$USER_ID" --role "$$role" --scope "$$SCOPE" >/dev/null 2>&1; \
				if [ $$? -eq 0 ]; then \
					echo "$(GREEN)✅ Removed $$role$(NC)"; \
				else \
					echo "$(RED)❌ Failed to remove $$role$(NC)"; \
				fi; \
			else \
				echo "$(YELLOW)⚠️  $$role not assigned$(NC)"; \
			fi; \
		done; \
	else \
		echo "$(RED)❌ Could not get your user ID$(NC)"; \
	fi

# Target to unassign role assignments at resource group level
.PHONY: unassign-geni-roles-rg
unassign-geni-roles-rg: ## Remove GENI role assignments from resource group scope
	@echo "$(BLUE)🎭 Attempting to unassign GENI roles from resource group...$(NC)"
	@USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	RESOURCE_GROUP=$$(az group list --query "[?contains(name, 'geni')].name | [0]" -o tsv); \
	if [ -n "$$USER_ID" ] && [ -n "$$RESOURCE_GROUP" ]; then \
		SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$$RESOURCE_GROUP"; \
		echo "$(BLUE)👤 User: $(ADMIN_UPN) ($$USER_ID)$(NC)"; \
		echo "$(BLUE)🎯 Scope: $$SCOPE$(NC)"; \
		echo ""; \
		for role in "$(GENI_ADMIN_ROLE)" "$(GENI_MANAGER_ROLE)" "$(GENI_OPERATOR_ROLE)"; do \
			echo "Removing role assignment: $$role..."; \
			EXISTING_ASSIGNMENT=$$(az role assignment list --assignee "$$USER_ID" --role "$$role" --scope "$$SCOPE" --query '[0].id' -o tsv 2>/dev/null); \
			if [ -n "$$EXISTING_ASSIGNMENT" ]; then \
				az role assignment delete --assignee "$$USER_ID" --role "$$role" --scope "$$SCOPE" >/dev/null 2>&1; \
				if [ $$? -eq 0 ]; then \
					echo "$(GREEN)✅ Removed $$role$(NC)"; \
				else \
					echo "$(RED)❌ Failed to remove $$role$(NC)"; \
				fi; \
			else \
				echo "$(YELLOW)⚠️  $$role not assigned$(NC)"; \
			fi; \
		done; \
	else \
		echo "$(RED)❌ Could not get user ID or resource group$(NC)"; \
	fi

# Target to check current GENI role assignments
.PHONY: check-geni-roles
check-geni-roles: ## Check current GENI role assignments
	@echo "$(BLUE)🔍 Checking current GENI role assignments...$(NC)"
	@USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	if [ -n "$$USER_ID" ]; then \
		echo "$(BLUE)👤 User: $(ADMIN_UPN) ($$USER_ID)$(NC)"; \
		echo "$(BLUE)📋 Subscription: $$SUBSCRIPTION_ID$(NC)"; \
		echo ""; \
		echo "GENI role assignments:"; \
		GENI_ASSIGNMENTS=$$(az role assignment list --assignee "$$USER_ID" --subscription "$$SUBSCRIPTION_ID" --query "[?contains(roleDefinitionName, 'GENI')].{Role:roleDefinitionName, Scope:scope}" -o table); \
		if [ -n "$$GENI_ASSIGNMENTS" ]; then \
			echo "$$GENI_ASSIGNMENTS"; \
		else \
			echo "$(YELLOW)⚠️  No GENI role assignments found$(NC)"; \
		fi; \
		echo ""; \
		echo "All role assignments:"; \
		az role assignment list --assignee "$$USER_ID" --subscription "$$SUBSCRIPTION_ID" --query '[].{Role:roleDefinitionName, Scope:scope}' -o table; \
	else \
		echo "$(RED)❌ Could not get your user ID$(NC)"; \
	fi

# Target to reassign GENI roles after unassigning
.PHONY: reassign-geni-roles
reassign-geni-roles: unassign-geni-roles ## Unassign and then reassign GENI roles
	@echo "$(BLUE)⏳ Waiting 5 seconds for unassignment to propagate...$(NC)"
	@sleep 5
	@echo "$(BLUE)🎭 Reassigning GENI roles...$(NC)"
	@USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	if [ -n "$$USER_ID" ]; then \
		for role in "$(GENI_ADMIN_ROLE)" "$(GENI_MANAGER_ROLE)" "$(GENI_OPERATOR_ROLE)"; do \
			echo "Assigning: $$role..."; \
			az role assignment create --assignee "$$USER_ID" --role "$$role" --scope "/subscriptions/$$SUBSCRIPTION_ID" >/dev/null 2>&1; \
			if [ $$? -eq 0 ]; then \
				echo "$(GREEN)✅ Assigned $$role$(NC)"; \
			else \
				echo "$(RED)❌ Failed to assign $$role$(NC)"; \
			fi; \
		done; \
	fi

.PHONY: create-resource-group
create-resource-group: set-subscription ## Create resource group for GENI
	@echo "$(BLUE)🏗️ Creating resource group...$(NC)"
	@if az group show --name "$(RESOURCE_GROUP)" >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Resource group $(RESOURCE_GROUP) already exists$(NC)"; \
	else \
		az group create --name "$(RESOURCE_GROUP)" --location eastus; \
		if [ $$? -eq 0 ]; then \
			echo "$(GREEN)✅ Created resource group $(RESOURCE_GROUP)$(NC)"; \
		else \
			echo "$(RED)❌ Failed to create resource group$(NC)"; \
		fi; \
	fi

.PHONY: create-app-registration
create-app-registration: set-subscription ## Create Azure AD app registration
	@echo "$(BLUE)📱 Creating Azure AD app registration...$(NC)"
	@if az ad app list --display-name "GENI JHipster Gateway" --query "[0].appId" -o tsv | grep -q .; then \
		echo "$(GREEN)✅ App registration already exists$(NC)"; \
		APP_ID=$$(az ad app list --display-name "GENI JHipster Gateway" --query "[0].appId" -o tsv); \
		echo "App ID: $$APP_ID"; \
	else \
		az ad app create \
			--display-name "GENI JHipster Gateway" \
			--web-redirect-uris "http://localhost:8080/login/oauth2/code/oidc" \
			--web-redirect-uris "https://geni-jhipster.azurewebsites.net/login/oauth2/code/oidc"; \
		if [ $$? -eq 0 ]; then \
			echo "$(GREEN)✅ Created app registration$(NC)"; \
			APP_ID=$$(az ad app list --display-name "GENI JHipster Gateway" --query "[0].appId" -o tsv); \
			echo "App ID: $$APP_ID"; \
			az ad sp create --id "$$APP_ID"; \
			echo "$(GREEN)✅ Created service principal$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Could not create app registration (permission denied)$(NC)"; \
		fi; \
	fi

.PHONY: continue-development
continue-development: ## Continue with JHipster development using current setup
	@echo "$(BLUE)🚀 Continue with JHipster development$(NC)"
	@echo ""
	@echo "$(GREEN)✅ You can continue with the 48-hour plan using:$(NC)"
	@echo ""
	@echo "1. Your own user account for testing: $(ADMIN_UPN)"
	@echo "2. Basic OAuth2 setup (single user, multiple roles)"
	@echo "3. JHipster development with simplified auth"
	@echo ""
	@echo "$(BLUE)Next steps:$(NC)"
	@echo "  1. Generate JHipster applications: $(GREEN)jhipster jdl geni-azure-microservices.jdl$(NC)"
	@echo "  2. Configure OAuth2 with your app registration"
	@echo "  3. Test with single user having multiple roles"
	@echo "  4. Request proper permissions for multi-user testing later"
	@echo ""
	@echo "$(YELLOW)⚠️  Save these for OAuth2 configuration:$(NC)"
	@APP_ID=$$(az ad app list --display-name "GENI JHipster Gateway" --query "[0].appId" -o tsv 2>/dev/null); \
	TENANT_ID=$$(az account show --query tenantId -o tsv); \
	echo "  AZURE_CLIENT_ID=$$APP_ID"; \
	echo "  AZURE_TENANT_ID=$$TENANT_ID"

.PHONY: show-environment-vars
show-environment-vars: set-subscription ## Show environment variables for JHipster
	@echo "$(BLUE)📋 Environment variables for JHipster configuration:$(NC)"
	@echo ""
	@APP_ID=$$(az ad app list --display-name "GENI JHipster Gateway" --query "[0].appId" -o tsv 2>/dev/null); \
	TENANT_ID=$$(az account show --query tenantId -o tsv); \
	SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	echo "export AZURE_CLIENT_ID=$$APP_ID"; \
	echo "export AZURE_TENANT_ID=$$TENANT_ID"; \
	echo "export AZURE_SUBSCRIPTION_ID=$$SUBSCRIPTION_ID"; \
	echo "export AZURE_DOMAIN=$(AZURE_DOMAIN)"; \
	echo "export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT-ID=$$APP_ID"; \
	echo "export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER-URI=https://login.microsoftonline.com/$$TENANT_ID/v2.0"; \
	echo ""
	@echo "$(YELLOW)⚠️  You'll need to generate a client secret:$(NC)"; \
	echo "az ad app credential reset --id \$$AZURE_CLIENT_ID --append"

.PHONY: workaround-summary
workaround-summary: ## Show summary of workaround approach
	@echo "$(BLUE)📋 GENI JHipster Development Workaround Summary$(NC)"
	@echo ""
	@echo "$(GREEN)✅ What you can do now:$(NC)"
	@echo "  1. Continue with JHipster development"
	@echo "  2. Use single-user testing (your account)"
	@echo "  3. Implement OAuth2 integration"
	@echo "  4. Build the application architecture"
	@echo "  5. Create database schemas and services"
	@echo ""
	@echo "$(YELLOW)⚠️  What requires admin permissions:$(NC)"
	@echo "  1. Creating multiple test users"
	@echo "  2. Managing security groups"
	@echo "  3. Azure AD role assignments"
	@echo ""
	@echo "$(BLUE)📞 Request from IT Admin:$(NC)"
	@echo "  Subject: Azure AD Permissions for GENI Development"
	@echo "  Roles needed: User Administrator, Groups Administrator, Application Administrator"
	@echo "  Account: $(ADMIN_UPN)"
	@echo ""
	@echo "$(GREEN)🚀 Continue with: make continue-development$(NC)"