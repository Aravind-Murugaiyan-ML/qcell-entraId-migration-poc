# Makefile for creating GENI JHipster test users

# Load environment variables from .env-user-creation file if it exists
-include .env-user-creation

# Default Variables (will be overridden by .env-user-creation if present)
AZURE_DOMAIN ?= your-domain.onmicrosoft.com
RESOURCE_GROUP ?= geni-jhipster-rg
SUBSCRIPTION_ID ?= your-subscription-id

# User Principal Names (constructed from AZURE_DOMAIN)
ADMIN_UPN ?= geniadmin@$(AZURE_DOMAIN)
MANAGER_UPN ?= genimanager@$(AZURE_DOMAIN)
OPERATOR_UPN ?= genioperator@$(AZURE_DOMAIN)

# User Passwords (should be set in .env-user-creation)
ADMIN_PASSWORD ?= ChangeMe123!
MANAGER_PASSWORD ?= ChangeMe456!
OPERATOR_PASSWORD ?= ChangeMe789!

# Security Groups
ADMIN_GROUP ?= GENI-Administrators
MANAGER_GROUP ?= GENI-Site-Managers
OPERATOR_GROUP ?= GENI-Operators

# Custom Roles
ADMIN_ROLE ?= GENI Administrator
MANAGER_ROLE ?= GENI Site Manager
OPERATOR_ROLE ?= GENI Operator

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[1;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

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
	@echo "$(YELLOW)Configuration:$(NC)"
	@echo "  Domain: $(AZURE_DOMAIN)"
	@echo "  Resource Group: $(RESOURCE_GROUP)" 
	@echo "  Subscription: $(SUBSCRIPTION_ID)"


# Show current configuration
.PHONY: show-config
show-config: ## Display current configuration values
	@echo "$(BLUE)🔧 Current Configuration:$(NC)"
	@echo "========================"
	@echo "AZURE_DOMAIN       = $(AZURE_DOMAIN)"
	@echo "RESOURCE_GROUP     = $(RESOURCE_GROUP)"
	@echo "SUBSCRIPTION_ID    = $(SUBSCRIPTION_ID)"
	@echo ""
	@echo "ADMIN_UPN          = $(ADMIN_UPN)"
	@echo "MANAGER_UPN        = $(MANAGER_UPN)"
	@echo "OPERATOR_UPN       = $(OPERATOR_UPN)"
	@echo ""
	@echo "ADMIN_PASSWORD     = ***hidden***"
	@echo "MANAGER_PASSWORD   = ***hidden***"
	@echo "OPERATOR_PASSWORD  = ***hidden***"
	@echo ""
	@echo "ADMIN_GROUP        = $(ADMIN_GROUP)"
	@echo "MANAGER_GROUP      = $(MANAGER_GROUP)"
	@echo "OPERATOR_GROUP     = $(OPERATOR_GROUP)"
	@echo ""
	@echo "ADMIN_ROLE         = $(ADMIN_ROLE)"
	@echo "MANAGER_ROLE       = $(MANAGER_ROLE)"
	@echo "OPERATOR_ROLE      = $(OPERATOR_ROLE)"
	@echo ""
	@if [ -f ".env-user-creation" ]; then \
		echo "$(GREEN)✅ Configuration loaded from .env-user-creation$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Using default configuration$(NC)"; \
	fi

# Check Azure login
.PHONY: check-login
check-login: ## Check if logged into Azure CLI
	@echo "$(BLUE)🔧 Checking Azure CLI session...$(NC)"
	@if az account show >/dev/null 2>&1; then \
		echo "$(GREEN)✅ Logged in as: $$(az account show --query user.name -o tsv)$(NC)"; \
	else \
		echo "$(RED)❌ Not logged in to Azure CLI$(NC)"; \
		echo "Run: az login"; \
		exit 1; \
	fi

# Set subscription
.PHONY: set-subscription
set-subscription: check-login ## Set Azure subscription
	@echo "$(BLUE)🔧 Setting subscription...$(NC)"
	@az account set --subscription "$(SUBSCRIPTION_ID)"
	@if [ $$? -eq 0 ]; then \
		echo "$(GREEN)✅ Subscription set to $(SUBSCRIPTION_ID)$(NC)"; \
	else \
		echo "$(RED)❌ Failed to set subscription$(NC)"; \
		exit 1; \
	fi

# Check prerequisites
.PHONY: check-prerequisites
check-prerequisites: set-subscription ## Check if groups and roles exist
	@echo "$(BLUE)🔍 Checking prerequisites...$(NC)"
	@echo "Checking security groups..."
	@for group in "$(ADMIN_GROUP)" "$(MANAGER_GROUP)" "$(OPERATOR_GROUP)"; do \
		if az ad group show --group "$$group" >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Group $$group exists$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Group $$group does not exist - will create if needed$(NC)"; \
		fi; \
	done
	@echo "Checking custom roles..."
	@for role in "$(ADMIN_ROLE)" "$(MANAGER_ROLE)" "$(OPERATOR_ROLE)"; do \
		if az role definition list --name "$$role" >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Role $$role exists$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role $$role does not exist - will need to be created$(NC)"; \
		fi; \
	done

# Create security groups
.PHONY: create-groups
create-groups: set-subscription ## Create security groups if they don't exist
	@echo "$(BLUE)👥 Creating security groups...$(NC)"
	@for group in "$(ADMIN_GROUP)" "$(MANAGER_GROUP)" "$(OPERATOR_GROUP)"; do \
		if az ad group show --group "$$group" >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Group $$group already exists$(NC)"; \
		else \
			echo "🔧 Creating group $$group..."; \
			MAIL_NICKNAME=$$(echo "$$group" | tr '[:upper:]' '[:lower:]' | tr '-' ''); \
			az ad group create --display-name "$$group" --mail-nickname "$$MAIL_NICKNAME"; \
			if [ $$? -eq 0 ]; then \
				echo "$(GREEN)✅ Created group $$group$(NC)"; \
			else \
				echo "$(RED)❌ Failed to create group $$group$(NC)"; \
				exit 1; \
			fi; \
		fi; \
	done

.PHONY: create-admin-user
create-admin-user: set-subscription ## Create GENI Test Administrator user
	@echo "$(BLUE)👤 Creating GENI Test Administrator...$(NC)"
	@if az ad user show --id "$(ADMIN_UPN)" >/dev/null 2>&1; then \
		echo "$(YELLOW)⚠️  User $(ADMIN_UPN) already exists$(NC)"; \
	else \
		az ad user create \
			--display-name "GENI Test Administrator" \
			--user-principal-name "$(ADMIN_UPN)" \
			--password "$(ADMIN_PASSWORD)"; \
		if [ $$? -eq 0 ]; then \
			echo "$(GREEN)✅ Created admin user $(ADMIN_UPN)$(NC)"; \
		else \
			echo "$(RED)❌ Failed to create admin user$(NC)"; \
			exit 1; \
		fi; \
	fi

.PHONY: create-manager-user
create-manager-user: set-subscription ## Create GENI Test Site Manager user
	@echo "$(BLUE)👤 Creating GENI Test Site Manager...$(NC)"
	@if az ad user show --id "$(MANAGER_UPN)" >/dev/null 2>&1; then \
		echo "$(YELLOW)⚠️  User $(MANAGER_UPN) already exists$(NC)"; \
	else \
		az ad user create \
			--display-name "GENI Test Site Manager" \
			--user-principal-name "$(MANAGER_UPN)" \
			--password "$(MANAGER_PASSWORD)"; \
		if [ $$? -eq 0 ]; then \
			echo "$(GREEN)✅ Created manager user $(MANAGER_UPN)$(NC)"; \
		else \
			echo "$(RED)❌ Failed to create manager user$(NC)"; \
			exit 1; \
		fi; \
	fi

.PHONY: create-operator-user
create-operator-user: set-subscription ## Create GENI Test Operator user
	@echo "$(BLUE)👤 Creating GENI Test Operator...$(NC)"
	@if az ad user show --id "$(OPERATOR_UPN)" >/dev/null 2>&1; then \
		echo "$(YELLOW)⚠️  User $(OPERATOR_UPN) already exists$(NC)"; \
	else \
		az ad user create \
			--display-name "GENI Test Operator" \
			--user-principal-name "$(OPERATOR_UPN)" \
			--password "$(OPERATOR_PASSWORD)"; \
		if [ $$? -eq 0 ]; then \
			echo "$(GREEN)✅ Created operator user $(OPERATOR_UPN)$(NC)"; \
		else \
			echo "$(RED)❌ Failed to create operator user$(NC)"; \
			exit 1; \
		fi; \
	fi

# Create all users
.PHONY: create-users
create-users: create-admin-user create-manager-user create-operator-user ## Create all test users
	@echo "$(GREEN)✅ All test users created!$(NC)"

# Assign users to groups
.PHONY: assign-groups
assign-groups:  ## Assign users to security groups
	@echo "$(BLUE)👥 Assigning users to groups...$(NC)"
	@echo "Assigning $(ADMIN_UPN) to $(ADMIN_GROUP)..."
	@ADMIN_USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$ADMIN_USER_ID" ]; then \
		az ad group member add --group "$(ADMIN_GROUP)" --member-id "$$ADMIN_USER_ID" 2>/dev/null || true; \
		echo "$(GREEN)✅ Added admin to $(ADMIN_GROUP)$(NC)"; \
	else \
		echo "$(RED)❌ Could not get admin user ID$(NC)"; \
		exit 1; \
	fi
	@echo "Assigning $(MANAGER_UPN) to $(MANAGER_GROUP)..."
	@MANAGER_USER_ID=$$(az ad user show --id "$(MANAGER_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$MANAGER_USER_ID" ]; then \
		az ad group member add --group "$(MANAGER_GROUP)" --member-id "$$MANAGER_USER_ID" 2>/dev/null || true; \
		echo "$(GREEN)✅ Added manager to $(MANAGER_GROUP)$(NC)"; \
	else \
		echo "$(RED)❌ Could not get manager user ID$(NC)"; \
		exit 1; \
	fi
	@echo "Assigning $(OPERATOR_UPN) to $(OPERATOR_GROUP)..."
	@OPERATOR_USER_ID=$$(az ad user show --id "$(OPERATOR_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$OPERATOR_USER_ID" ]; then \
		az ad group member add --group "$(OPERATOR_GROUP)" --member-id "$$OPERATOR_USER_ID" 2>/dev/null || true; \
		echo "$(GREEN)✅ Added operator to $(OPERATOR_GROUP)$(NC)"; \
	else \
		echo "$(RED)❌ Could not get operator user ID$(NC)"; \
		exit 1; \
	fi

# Assign Azure roles
.PHONY: assign-roles
assign-roles: ## Assign custom Azure roles to users
	@echo "$(BLUE)🎭 Assigning Azure roles...$(NC)"
	@SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
	echo "Using scope: $$RESOURCE_GROUP_SCOPE"
	@echo "Assigning $(ADMIN_ROLE) to $(ADMIN_UPN)..."
	@ADMIN_USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$ADMIN_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment create \
			--assignee "$$ADMIN_USER_ID" \
			--role "$(ADMIN_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Assigned $(ADMIN_ROLE) to admin$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role assignment failed - check if role exists$(NC)"; \
		fi; \
	fi
	@echo "Assigning $(MANAGER_ROLE) to $(MANAGER_UPN)..."
	@MANAGER_USER_ID=$$(az ad user show --id "$(MANAGER_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$MANAGER_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment create \
			--assignee "$$MANAGER_USER_ID" \
			--role "$(MANAGER_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Assigned $(MANAGER_ROLE) to manager$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role assignment failed - check if role exists$(NC)"; \
		fi; \
	fi
	@echo "Assigning $(OPERATOR_ROLE) to $(OPERATOR_UPN)..."
	@OPERATOR_USER_ID=$$(az ad user show --id "$(OPERATOR_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$OPERATOR_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment create \
			--assignee "$$OPERATOR_USER_ID" \
			--role "$(OPERATOR_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Assigned $(OPERATOR_ROLE) to operator$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role assignment failed - check if role exists$(NC)"; \
		fi; \
	fi

# Unassign Azure roles
.PHONY: unassign-roles
unassign-roles: set-subscription ## Unassign custom Azure roles from users
	@echo "$(BLUE)🎭 Unassigning Azure roles...$(NC)"
	@SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
	RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
	echo "Using scope: $$RESOURCE_GROUP_SCOPE"
	@echo "Unassigning $(ADMIN_ROLE) from $(ADMIN_UPN)..."
	@ADMIN_USER_ID=$$(az ad user show --id "$(ADMIN_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$ADMIN_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment delete \
			--assignee "$$ADMIN_USER_ID" \
			--role "$(ADMIN_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Unassigned $(ADMIN_ROLE) from admin$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role unassignment failed - assignment may not exist$(NC)"; \
		fi; \
	else \
		echo "$(RED)❌ Admin user not found$(NC)"; \
	fi
	@echo "Unassigning $(MANAGER_ROLE) from $(MANAGER_UPN)..."
	@MANAGER_USER_ID=$$(az ad user show --id "$(MANAGER_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$MANAGER_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment delete \
			--assignee "$$MANAGER_USER_ID" \
			--role "$(MANAGER_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Unassigned $(MANAGER_ROLE) from manager$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role unassignment failed - assignment may not exist$(NC)"; \
		fi; \
	else \
		echo "$(RED)❌ Manager user not found$(NC)"; \
	fi
	@echo "Unassigning $(OPERATOR_ROLE) from $(OPERATOR_UPN)..."
	@OPERATOR_USER_ID=$$(az ad user show --id "$(OPERATOR_UPN)" --query id -o tsv 2>/dev/null); \
	if [ -n "$$OPERATOR_USER_ID" ]; then \
		SUBSCRIPTION_ID=$$(az account show --query id -o tsv); \
		RESOURCE_GROUP_SCOPE="/subscriptions/$$SUBSCRIPTION_ID/resourceGroups/$(RESOURCE_GROUP)"; \
		if az role assignment delete \
			--assignee "$$OPERATOR_USER_ID" \
			--role "$(OPERATOR_ROLE)" \
			--scope "$$RESOURCE_GROUP_SCOPE" 2>/dev/null; then \
			echo "$(GREEN)✅ Unassigned $(OPERATOR_ROLE) from operator$(NC)"; \
		else \
			echo "$(YELLOW)⚠️  Role unassignment failed - assignment may not exist$(NC)"; \
		fi; \
	else \
		echo "$(RED)❌ Operator user not found$(NC)"; \
	fi
	@echo "$(GREEN)🎉 Role unassignment process completed!$(NC)"

.PHONY: list-role-assignments
list-role-assignments: set-subscription ## List all GENI role assignments
	@echo "$(BLUE)📋 GENI Role Assignments:$(NC)"
	@echo "$(BLUE)Resource Group: $(RESOURCE_GROUP)$(NC)"
	@echo ""
	@echo "$(YELLOW)Assignments by Role:$(NC)"
	@for role in "$(ADMIN_ROLE)" "$(MANAGER_ROLE)" "$(OPERATOR_ROLE)"; do \
		echo "$(BLUE)Role: $$role$(NC)"; \
		az role assignment list --role "$$role" --resource-group "$(RESOURCE_GROUP)" --query '[].{User:principalName, Scope:scope}' --output table 2>/dev/null || echo "  No assignments found"; \
		echo ""; \
	done
	@echo "$(YELLOW)Assignments by User:$(NC)"
	@for user in "$(ADMIN_UPN)" "$(MANAGER_UPN)" "$(OPERATOR_UPN)"; do \
		echo "$(BLUE)User: $$user$(NC)"; \
		az role assignment list --assignee "$$user" --resource-group "$(RESOURCE_GROUP)" --query '[].{Role:roleDefinitionName, Scope:scope}' --output table 2>/dev/null || echo "  No assignments found"; \
		echo ""; \
	done
	@echo ""
	@echo "$(YELLOW)All GENI assignments in resource group:$(NC)"
	@az role assignment list --resource-group "$(RESOURCE_GROUP)" --query "[?contains(roleDefinitionName, 'GENI')].{User:principalName, Role:roleDefinitionName, Scope:scope}" --output table 2>/dev/null || echo "No GENI assignments found"

# Complete setup
.PHONY: setup-all
setup-all: create-groups create-users assign-groups assign-roles ## Complete test user setup (recommended)
	@echo ""
	@echo "$(GREEN)🎉 Test users setup completed!$(NC)"
	@echo ""
	@echo "$(BLUE)Created users:$(NC)"
	@echo "  $(GREEN)Admin:$(NC)    $(ADMIN_UPN)"
	@echo "  $(GREEN)Manager:$(NC)  $(MANAGER_UPN)"
	@echo "  $(GREEN)Operator:$(NC) $(OPERATOR_UPN)"
	@echo ""
	@echo "$(BLUE)Passwords:$(NC)"
	@echo "  Admin: $(ADMIN_PASSWORD)"
	@echo "  Manager: $(MANAGER_PASSWORD)"
	@echo "  Operator: $(OPERATOR_PASSWORD)"
	@echo ""
	@echo "$(YELLOW)⚠️  Store these credentials securely!$(NC)"

# List created users
.PHONY: list-users
list-users: set-subscription ## List all GENI test users
	@echo "$(BLUE)📋 GENI Test Users:$(NC)"
	@az ad user list --filter "startswith(userPrincipalName,'geni')" \
		--query "[].{Name:displayName, UPN:userPrincipalName, Department:department, JobTitle:jobTitle}" \
		--output table 2>/dev/null || echo "$(YELLOW)⚠️  No users found or insufficient permissions$(NC)"

# Verify setup
.PHONY: verify-setup
verify-setup: set-subscription ## Verify complete user setup
	@echo "$(BLUE)🔍 Verifying setup...$(NC)"
	@echo ""
	@echo "$(BLUE)Users:$(NC)"
	@for user in "$(ADMIN_UPN)" "$(MANAGER_UPN)" "$(OPERATOR_UPN)"; do \
		if az ad user show --id "$$user" >/dev/null 2>&1; then \
			echo "$(GREEN)✅ $$user exists$(NC)"; \
		else \
			echo "$(RED)❌ $$user not found$(NC)"; \
		fi; \
	done
	@echo ""
	@echo "$(BLUE)Group memberships:$(NC)"
	@for user in "$(ADMIN_UPN)" "$(MANAGER_UPN)" "$(OPERATOR_UPN)"; do \
		echo "User: $$user"; \
		GROUPS=$$(az ad user get-member-groups --id "$$user" --query "[].displayName" -o tsv 2>/dev/null); \
		if [ -n "$$GROUPS" ]; then \
			echo "$$GROUPS" | sed 's/^/  $(GREEN)✅ /'; \
		else \
			echo "$(YELLOW)  ⚠️  No groups found$(NC)"; \
		fi; \
		echo ""; \
	done

# Clean up - delete all test users
.PHONY: cleanup
cleanup: set-subscription ## Delete all GENI test users
	@echo "$(YELLOW)⚠️  This will delete all GENI test users!$(NC)"
	@echo "Press Ctrl+C to cancel, or Enter to continue..."
	@read dummy
	@echo "$(BLUE)🗑️  Deleting test users...$(NC)"
	@for user in "$(ADMIN_UPN)" "$(MANAGER_UPN)" "$(OPERATOR_UPN)"; do \
		if az ad user show --id "$$user" >/dev/null 2>&1; then \
			echo "Deleting $$user..."; \
			az ad user delete --id "$$user"; \
			if [ $$? -eq 0 ]; then \
				echo "$(GREEN)✅ Deleted $$user$(NC)"; \
			else \
				echo "$(RED)❌ Failed to delete $$user$(NC)"; \
			fi; \
		else \
			echo "$(YELLOW)⚠️  User $$user not found$(NC)"; \
		fi; \
	done
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

# Test basic functionality
.PHONY: test
test: set-subscription ## Test user creation (dry run)
	@echo "$(BLUE)🧪 Testing Azure AD permissions...$(NC)"
	@echo "Testing user creation permission..."
	@az ad user create \
		--display-name "Permission Test" \
		--user-principal-name "permtest@$(AZURE_DOMAIN)" \
		--password "TempTest123!" >/dev/null 2>&1; \
	if [ $$? -eq 0 ]; then \
		echo "$(GREEN)✅ User creation test passed$(NC)"; \
		az ad user delete --id "permtest@$(AZURE_DOMAIN)" >/dev/null 2>&1; \
		echo "$(GREEN)✅ Test user cleaned up$(NC)"; \
	else \
		echo "$(RED)❌ User creation test failed$(NC)"; \
		echo "$(YELLOW)You may need additional permissions from your Azure AD administrator$(NC)"; \
	fi

# Show current Azure context
.PHONY: context
context: check-login ## Show current Azure context
	@echo "$(BLUE)📋 Current Azure Context:$(NC)"
	@echo "$(BLUE)User:$(NC) $$(az account show --query user.name -o tsv)"
	@echo "$(BLUE)Subscription:$(NC) $$(az account show --query name -o tsv)"
	@echo "$(BLUE)Tenant:$(NC) $$(az account show --query tenantId -o tsv)"
	@echo "$(BLUE)Domain:$(NC) $(AZURE_DOMAIN)"
	@echo "$(BLUE)Resource Group:$(NC) $(RESOURCE_GROUP)"

# Clean up configuration file
.PHONY: clean-config
clean-config: ## Remove .env-user-creation configuration file
	@echo "$(BLUE)🧹 Cleaning up configuration file...$(NC)"
	@rm -f .env-user-creation
	@echo "$(GREEN)✅ Configuration file removed$(NC)"