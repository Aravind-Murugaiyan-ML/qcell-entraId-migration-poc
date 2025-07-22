# Makefile for running yarn audit and fixing vulnerabilities

# Variables
YARN = yarn
PACKAGE_JSON = package.json

# Default target
.PHONY: all
all: audit

# Run yarn audit to check for vulnerabilities
.PHONY: audit
audit:
	@echo "🔍 Running yarn audit to check for vulnerabilities..."
	@$(YARN) audit

# Attempt to fix vulnerabilities by upgrading packages
.PHONY: audit-fix
audit-fix:
	@echo "🛠️ Upgrading dependencies to fix vulnerabilities..."
	@$(YARN) upgrade --latest
	@echo "🔍 Re-running yarn audit to verify fixes..."
	@$(YARN) audit

# Add resolutions to package.json to force patched versions
.PHONY: force-resolutions
force-resolutions:
	@echo "🛠️ Adding resolutions to package.json to enforce patched versions..."
	@jq '.resolutions = {"vite":">=4.5.14","axios":">=1.8.2","webpack":">=5.94.0","webpack-dev-middleware":">=6.1.2","webpack-dev-server":">=5.2.1","esbuild":">=0.25.0","@babel/runtime":">=7.26.10","form-data":">=2.5.4","tough-cookie":">=4.1.3","ejs":">=3.1.10","@octokit/request":">=8.4.1","@octokit/request-error":">=5.1.1","@octokit/plugin-paginate-rest":">=9.2.2","send":">=0.19.0","serve-static":">=1.16.0"}' $(PACKAGE_JSON) > tmp.json && mv tmp.json $(PACKAGE_JSON) || { echo "❌ Failed to update package.json with jq"; exit 1; }
	@echo "⚠️ Warning: 'request' package is deprecated and unpatched. Consider updating generator-jhipster or replacing request with axios."
	@echo "🔄 Re-installing dependencies with resolutions..."
	@$(YARN) install
	@echo "🔍 Re-running yarn audit to verify fixes..."
	@$(YARN) audit

# Clean up node_modules and yarn.lock
.PHONY: clean
clean:
	@echo "🧹 Cleaning node_modules and yarn.lock..."
	@rm -rf node_modules yarn.lock
	@echo "🔄 Re-installing dependencies..."
	@$(YARN) install

# Help target
.PHONY: help
help:
	@echo "Makefile for running yarn audit and fixing vulnerabilities"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  all              Run yarn audit (default)"
	@echo "  audit           Run yarn audit to check for vulnerabilities"
	@echo "  audit-fix       Upgrade dependencies to latest versions and re-run audit"
	@echo "  force-resolutions Add resolutions to package.json to enforce patched versions"
	@echo "  clean           Remove node_modules and yarn.lock, then re-install"
	@echo "  help            Display this help message"
	@echo ""
	@echo "Variables:"
	@echo "  YARN            Yarn command: $(YARN)"
	@echo "  PACKAGE_JSON    Package.json file: $(PACKAGE_JSON)"