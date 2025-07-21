# GENI Azure JHipster Project Makefile
# ====================================

# Variables
JHIPSTER_VERSION := 8.0.0
NODE_VERSION := 20
JDL_FILE := geni-azure-simplified.jdl
GATEWAY_DIR := genigateway
MICROSERVICE_DIR := genisiteservice

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

# Help target - displays all available targets
# Default target
help: ## Display help information for all available targets
	@echo "Available Makefile targets:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*##.*$$' Makefile | sort | awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' || echo "Error: No targets with descriptions found. Ensure 'awk' and 'grep' are installed."

# ============================================================================
# Environment Setup
# ============================================================================



check-tools: ## Check if required tools are installed
	@echo "Checking required tools..."
	@echo "NVM version: $$(bash -c '. ~/.nvm/nvm.sh && nvm --version' 2>/dev/null || echo 'Not installed')"
	@echo "NPM version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "Node.js version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "Java version: $$(java --version 2>/dev/null | head -n 1 || echo 'Not installed')"
	@echo "Tools check completed."

setup: ## Complete environment setup (Node.js + JHipster)
	@echo "$(GREEN)Setting up development environment...$(RESET)"
	@make check-tools
	@make ensure-node
	@make ensure-jhipster
	@make install-jhipster-azure-container-apps
	@echo "$(GREEN)Environment setup complete!$(RESET)"

ensure-node: ## Install Node.js only if not installed or wrong version
	@if ! node --version 2>/dev/null | grep -q "v$(NODE_VERSION)" ; then \
		echo "$(BLUE)Node.js $(NODE_VERSION) not found, installing...$(RESET)"; \
		make setup-node; \
	else \
		echo "$(GREEN)Node.js $(NODE_VERSION) already installed, skipping...$(RESET)"; \
	fi

ensure-jhipster: ## Install JHipster only if not installed or wrong version
	@if ! jhipster --version 2>/dev/null | grep -q "$(JHIPSTER_VERSION)" ; then \
		echo "$(BLUE)JHipster $(JHIPSTER_VERSION) not found, installing...$(RESET)"; \
		make install-jhipster; \
	else \
		echo "$(GREEN)JHipster $(JHIPSTER_VERSION) already installed, skipping...$(RESET)"; \
	fi

setup-node: 
	@echo "$(BLUE)Setting up Node.js $(NODE_VERSION)...$(RESET)"
	@bash -c "source ~/.nvm/nvm.sh && nvm install $(NODE_VERSION) && nvm use $(NODE_VERSION) && nvm alias default $(NODE_VERSION)"
	@echo "$(GREEN)Node.js setup complete.$(RESET)"

install-jhipster: 
	@echo "$(BLUE)Installing JHipster $(JHIPSTER_VERSION)...$(RESET)"
	@npm install -g generator-jhipster@$(JHIPSTER_VERSION) --silent --no-audit --no-fund
	@echo "$(GREEN)JHipster $(JHIPSTER_VERSION) installed successfully.$(RESET)"
	@jhipster --version

install-jhipster-azure-container-apps: ## Install JHipster generator for Azure Container Apps
	@echo "$(BLUE)Installing JHipster generator for Azure Container Apps...$(RESET)"
	npm install -g generator-jhipster-azure-container-apps --silent --no-audit --no-fund
	@echo "$(GREEN)JHipster generator for Azure Container Apps installed successfully.$(RESET)"
	@jhipster --version

uninstall-jhipster: ## Uninstall JHipster globally
	@echo "$(BLUE)Uninstalling JHipster...$(RESET)"
	@npm uninstall -g generator-jhipster || echo "$(YELLOW)NPM uninstall failed, trying sudo...$(RESET)"
	@sudo npm uninstall -g generator-jhipster || echo "$(YELLOW)Could not uninstall via npm$(RESET)"
	@echo "$(BLUE)Cleaning up npm cache...$(RESET)"
	@npm cache clean --force
	@echo "$(GREEN)JHipster uninstalled successfully.$(RESET)"

upgrade-jhipster: ## Upgrade JHipster to latest version
	@echo "$(BLUE)Upgrading JHipster...$(RESET)"
	@make uninstall-jhipster
	@npm install -g generator-jhipster@latest --silent --no-audit --no-fund
	@echo "$(GREEN)JHipster upgraded successfully.$(RESET)"
	@jhipster --version

# ============================================================================
# JDL and Application Management
# ============================================================================

validate: ## Validate JDL file syntax and structure
	@echo "$(BLUE)Validating JDL file: $(JDL_FILE)$(RESET)"
	@test -f $(JDL_FILE) || { echo "$(RED)Error: JDL file '$(JDL_FILE)' not found.$(RESET)"; exit 1; }
	@jhipster jdl $(JDL_FILE) --dry-run
	@echo "$(GREEN)JDL validation successful!$(RESET)"

generate: ## Generate JHipster applications from JDL
	@echo "$(BLUE)Generating applications from $(JDL_FILE)...$(RESET)"
	@make validate
	@jhipster jdl $(JDL_FILE)
	@echo "$(GREEN)Applications generated successfully!$(RESET)"

regenerate: ## Clean and regenerate applications
	@echo "$(BLUE)Cleaning existing applications...$(RESET)"
	@make clean-apps
	@echo "$(BLUE)Regenerating applications...$(RESET)"
	@make generate

# ============================================================================
# Dependencies Management
# ============================================================================

install-deps: ## Install dependencies for all applications
	@echo "$(BLUE)Installing dependencies for all applications...$(RESET)"
	@make install-gateway-deps
	@make install-microservice-deps
	@echo "$(GREEN)All dependencies installed successfully!$(RESET)"

install-gateway-deps: ## Install gateway dependencies
	@echo "$(BLUE)Installing gateway dependencies...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && npm install --ignore-scripts --no-audit --no-fund; \
		echo "$(GREEN)Gateway dependencies installed.$(RESET)"; \
	else \
		echo "$(YELLOW)Gateway directory not found. Run 'make generate' first.$(RESET)"; \
	fi

install-microservice-deps: ## Install microservice dependencies
	@echo "$(BLUE)Installing microservice dependencies...$(RESET)"
	@if [ -d "$(MICROSERVICE_DIR)" ]; then \
		cd $(MICROSERVICE_DIR) && npm install --ignore-scripts --no-audit --no-fund; \
		echo "$(GREEN)Microservice dependencies installed.$(RESET)"; \
	else \
		echo "$(YELLOW)Microservice directory not found. Run 'make generate' first.$(RESET)"; \
	fi

update-deps: ## Update dependencies for all applications
	@echo "$(BLUE)Updating dependencies...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then cd $(GATEWAY_DIR) && npm update; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then cd $(MICROSERVICE_DIR) && npm update; fi
	@echo "$(GREEN)Dependencies updated successfully!$(RESET)"

# ============================================================================
# Development Servers
# ============================================================================

dev: ## Start all development servers
	@echo "$(BLUE)Starting development servers...$(RESET)"
	@echo "$(YELLOW)Starting gateway in background...$(RESET)"
	@make dev-gateway &
	@sleep 10
	@echo "$(YELLOW)Starting microservice in background...$(RESET)"
	@make dev-microservice &
	@echo "$(GREEN)Development servers started!$(RESET)"
	@echo "$(BLUE)Gateway: http://localhost:8080$(RESET)"
	@echo "$(BLUE)Microservice: http://localhost:8081$(RESET)"
	@echo "$(YELLOW)Press Ctrl+C to stop all servers$(RESET)"
	@wait

dev-gateway: ## Start gateway development server
	@echo "$(BLUE)Starting gateway development server...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && npm start; \
	else \
		echo "$(RED)Error: Gateway directory not found. Run 'make generate' first.$(RESET)"; \
		exit 1; \
	fi

dev-microservice: ## Start microservice development server
	@echo "$(BLUE)Starting microservice development server...$(RESET)"
	@if [ -d "$(MICROSERVICE_DIR)" ]; then \
		cd $(MICROSERVICE_DIR) && ./mvnw spring-boot:run; \
	else \
		echo "$(RED)Error: Microservice directory not found. Run 'make generate' first.$(RESET)"; \
		exit 1; \
	fi

dev-frontend: ## Start only frontend development server
	@echo "$(BLUE)Starting frontend development server...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && npm start; \
	else \
		echo "$(RED)Error: Gateway directory not found.$(RESET)"; \
		exit 1; \
	fi

dev-backend: ## Start only backend development servers
	@echo "$(BLUE)Starting backend development servers...$(RESET)"
	@make dev-gateway-backend &
	@make dev-microservice &
	@wait

dev-gateway-backend: ## Start gateway backend only
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && ./mvnw spring-boot:run; \
	fi

# ============================================================================
# Testing
# ============================================================================

test: ## Run all tests
	@echo "$(BLUE)Running all tests...$(RESET)"
	@make test-gateway
	@make test-microservice
	@echo "$(GREEN)All tests completed!$(RESET)"

test-gateway: ## Run gateway tests
	@echo "$(BLUE)Running gateway tests...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && npm test; \
	else \
		echo "$(YELLOW)Gateway directory not found.$(RESET)"; \
	fi

test-microservice: ## Run microservice tests
	@echo "$(BLUE)Running microservice tests...$(RESET)"
	@if [ -d "$(MICROSERVICE_DIR)" ]; then \
		cd $(MICROSERVICE_DIR) && ./mvnw test; \
	else \
		echo "$(YELLOW)Microservice directory not found.$(RESET)"; \
	fi

# ============================================================================
# Build and Package
# ============================================================================

build: ## Build all applications for production
	@echo "$(BLUE)Building all applications...$(RESET)"
	@make build-gateway
	@make build-microservice
	@echo "$(GREEN)All applications built successfully!$(RESET)"

build-gateway: ## Build gateway for production
	@echo "$(BLUE)Building gateway...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then \
		cd $(GATEWAY_DIR) && npm run build && ./mvnw -Pprod clean verify; \
	fi

build-microservice: ## Build microservice for production
	@echo "$(BLUE)Building microservice...$(RESET)"
	@if [ -d "$(MICROSERVICE_DIR)" ]; then \
		cd $(MICROSERVICE_DIR) && ./mvnw -Pprod clean verify; \
	fi

# ============================================================================
# Docker Support
# ============================================================================

docker-build: ## Build Docker images for all applications
	@echo "$(BLUE)Building Docker images...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then cd $(GATEWAY_DIR) && ./mvnw -Pprod verify jib:dockerBuild; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then cd $(MICROSERVICE_DIR) && ./mvnw -Pprod verify jib:dockerBuild; fi
	@echo "$(GREEN)Docker images built successfully!$(RESET)"

docker-compose: ## Start applications using Docker Compose
	@echo "$(BLUE)Starting applications with Docker Compose...$(RESET)"
	@docker-compose up -d
	@echo "$(GREEN)Applications started with Docker Compose!$(RESET)"

# ============================================================================
# Cleanup
# ============================================================================

clean: ## Clean all generated files and dependencies
	@echo "$(BLUE)Cleaning all generated files...$(RESET)"
	@make clean-deps
	@make clean-build
	@echo "$(GREEN)Cleanup completed!$(RESET)"

clean-apps: ## Remove generated application directories
	@echo "$(BLUE)Removing generated applications...$(RESET)"
	@rm -rf $(GATEWAY_DIR) $(MICROSERVICE_DIR)
	@echo "$(GREEN)Generated applications removed.$(RESET)"

clean-deps: ## Clean node_modules and package-lock.json
	@echo "$(BLUE)Cleaning dependencies...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then cd $(GATEWAY_DIR) && rm -rf node_modules package-lock.json; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then cd $(MICROSERVICE_DIR) && rm -rf node_modules package-lock.json; fi
	@echo "$(GREEN)Dependencies cleaned.$(RESET)"

clean-build: ## Clean build artifacts
	@echo "$(BLUE)Cleaning build artifacts...$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then cd $(GATEWAY_DIR) && rm -rf target/ build/ dist/; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then cd $(MICROSERVICE_DIR) && rm -rf target/ build/; fi
	@echo "$(GREEN)Build artifacts cleaned.$(RESET)"

clean-cache: ## Clean npm and Maven caches
	@echo "$(BLUE)Cleaning caches...$(RESET)"
	@npm cache clean --force
	@if [ -d "$(GATEWAY_DIR)" ]; then cd $(GATEWAY_DIR) && ./mvnw dependency:purge-local-repository || true; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then cd $(MICROSERVICE_DIR) && ./mvnw dependency:purge-local-repository || true; fi
	@echo "$(GREEN)Caches cleaned.$(RESET)"

# ============================================================================
# Maintenance and Information
# ============================================================================

status: ## Show status of all components
	@echo "$(BLUE)=== Environment Status ===$(RESET)"
	@echo "Node.js version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "NPM version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "JHipster version: $$(jhipster --version 2>/dev/null || echo 'Not installed')"
	@echo "Available Generators:"
	@yo --generators | grep -E "(jhipster|azure)"
	@echo "Java version: $$(java -version 2>&1 | head -n 1 || echo 'Not installed')"
	@echo ""
	@echo "$(BLUE)=== Project Status ===$(RESET)"
	@echo "JDL file: $$(test -f $(JDL_FILE) && echo '✓ Found' || echo '✗ Missing')"
	@echo "Gateway directory: $$(test -d $(GATEWAY_DIR) && echo '✓ Generated' || echo '✗ Not generated')"
	@echo "Microservice directory: $$(test -d $(MICROSERVICE_DIR) && echo '✓ Generated' || echo '✗ Not generated')"

info: ## Display project information
	@echo "$(BLUE)=== GENI Azure JHipster Project ===$(RESET)"
	@echo "JDL File: $(JDL_FILE)"
	@echo "Gateway App: $(GATEWAY_DIR)"
	@echo "Microservice App: $(MICROSERVICE_DIR)"
	@echo "JHipster Version: $(JHIPSTER_VERSION)"
	@echo "Node.js Version: $(NODE_VERSION)"
	@echo ""
	@echo "$(YELLOW)Architecture:$(RESET)"
	@echo "- Gateway Service (Port 8080) - Azure integration & UI"
	@echo "- Site Service (Port 8081) - Energy sites & devices"
	@echo ""
	@echo "$(YELLOW)Key Features:$(RESET)"
	@echo "- Azure Entra ID authentication"
	@echo "- OAuth2 security"
	@echo "- PostgreSQL databases"
	@echo "- Apache Kafka messaging"
	@echo "- Angular frontend"

logs: ## Show development server logs
	@echo "$(BLUE)Recent development logs:$(RESET)"
	@if [ -d "$(GATEWAY_DIR)" ]; then echo "=== Gateway Logs ==="; tail -20 $(GATEWAY_DIR)/*.log 2>/dev/null || echo "No gateway logs found"; fi
	@if [ -d "$(MICROSERVICE_DIR)" ]; then echo "=== Microservice Logs ==="; tail -20 $(MICROSERVICE_DIR)/*.log 2>/dev/null || echo "No microservice logs found"; fi

# ============================================================================
# .PHONY Declaration
# ============================================================================

.PHONY: help setup check-tools setup-node install-jhipster uninstall-jhipster upgrade-jhipster \
        validate generate regenerate install-deps install-gateway-deps install-microservice-deps update-deps \
        dev dev-gateway dev-microservice dev-frontend dev-backend dev-gateway-backend \
        test test-gateway test-microservice build build-gateway build-microservice \
        docker-build docker-compose clean clean-apps clean-deps clean-build clean-cache \
        status info logs