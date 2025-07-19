#!/bin/bash

# Script to update subscription ID in Azure role definition JSON files
# Reads subscription ID from .env-az-roles file and updates JSON files

set -uo pipefail  # Exit on undefined variables and pipe failures, but continue on command errors

# Configuration
ENV_FILE=".env-az-roles"
ROLES_DIR="azure-roles"
BACKUP_SUFFIX=".bak"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔧${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Function to extract SUBSCRIPTION_ID from .env-az-roles file
extract_subscription_id() {
    local env_file="$1"
    
    # Extract SUBSCRIPTION_ID from Makefile-style format
    # Handle both "SUBSCRIPTION_ID = value" and "SUBSCRIPTION_ID=value"
    local subscription_id=$(grep -E '^[[:space:]]*SUBSCRIPTION_ID[[:space:]]*=' "$env_file" | \
                           grep -v '^[[:space:]]*#' | \
                           sed -E 's/^[[:space:]]*SUBSCRIPTION_ID[[:space:]]*=[[:space:]]*//' | \
                           sed -E 's/[[:space:]]*$//' | \
                           head -1)
    
    echo "$subscription_id"
}

# Function to validate subscription ID format
validate_subscription_id() {
    local sub_id="$1"
    
    # Azure subscription ID is a GUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    if [[ $sub_id =~ ^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to find and replace subscription ID in JSON files
update_subscription_in_file() {
    local file="$1"
    local new_subscription_id="$2"
    local updated=false
    
    if [[ ! -f "$file" ]]; then
        print_warning "File not found: $file"
        return 0  # Return success to continue processing other files
    fi
    
    print_status "Processing: $file"
    
    # Create backup
    if ! cp "$file" "${file}${BACKUP_SUFFIX}"; then
        print_error "Failed to create backup for $file"
        return 0  # Continue processing other files
    fi
    print_status "Created backup: ${file}${BACKUP_SUFFIX}"
    
    # Find current subscription IDs in the file
    local current_subs
    current_subs=$(grep -oE '/subscriptions/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/' "$file" | \
                  sed 's|/subscriptions/||' | \
                  sed 's|/$||' | \
                  sort -u) || current_subs=""
    
    if [[ -z "$current_subs" ]]; then
        print_warning "No subscription IDs found in $file - file may already be updated or have different format"
        return 0  # Continue processing other files
    fi
    
    # Replace each found subscription ID
    while IFS= read -r old_sub_id; do
        if [[ -n "$old_sub_id" && "$old_sub_id" != "$new_subscription_id" ]]; then
            print_status "Replacing: $old_sub_id → $new_subscription_id"
            
            # Use sed to replace the subscription ID in the AssignableScopes
            if sed -i.tmp "s|/subscriptions/$old_sub_id/|/subscriptions/$new_subscription_id/|g" "$file"; then
                rm -f "${file}.tmp"
                updated=true
            else
                print_error "Failed to update $file"
                return 0  # Continue processing other files
            fi
        elif [[ "$old_sub_id" == "$new_subscription_id" ]]; then
            print_success "Already up to date: $old_sub_id"
        fi
    done <<< "$current_subs"
    
    if [[ "$updated" == true ]]; then
        print_success "Updated: $file"
    else
        print_status "No changes needed: $file"
    fi
    
    return 0  # Always return success to continue processing
}

# Function to show differences
show_changes() {
    local file="$1"
    local backup_file="${file}${BACKUP_SUFFIX}"
    
    if [[ -f "$backup_file" ]]; then
        echo
        print_status "Changes in $file:"
        echo "----------------------------------------"
        if diff "$backup_file" "$file" >/dev/null 2>&1; then
            echo "No changes made to this file"
        else
            diff "$backup_file" "$file" || true
        fi
        echo "----------------------------------------"
    fi
}

# Function to cleanup backup files
cleanup_backups() {
    local backup_files=($(find "$ROLES_DIR" -name "*${BACKUP_SUFFIX}" -type f 2>/dev/null))
    
    if [[ ${#backup_files[@]} -eq 0 ]]; then
        print_status "No backup files found to clean up"
        return 0
    fi
    
    echo
    print_status "Found ${#backup_files[@]} backup files:"
    for backup in "${backup_files[@]}"; do
        echo "  • $backup"
    done
    
    echo
    read -p "🧹 Remove backup files? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for backup in "${backup_files[@]}"; do
            rm -f "$backup"
            print_status "Removed: $backup"
        done
        print_success "All backup files removed"
    else
        print_status "Backup files kept for safety"
    fi
}

# Main execution
main() {
    echo "🔄 Azure Role Subscription ID Updater"
    echo "======================================"
    
    # Check if environment file exists
    if [[ ! -f "$ENV_FILE" ]]; then
        print_error "Environment file '$ENV_FILE' not found!"
        print_status "Please create '$ENV_FILE' with SUBSCRIPTION_ID = your-subscription-id"
        exit 1
    fi
    
    # Extract subscription ID from environment file
    print_status "Reading subscription ID from '$ENV_FILE'..."
    NEW_SUBSCRIPTION_ID=$(extract_subscription_id "$ENV_FILE")
    
    if [[ -z "$NEW_SUBSCRIPTION_ID" ]]; then
        print_error "Could not extract SUBSCRIPTION_ID from '$ENV_FILE'"
        print_status "Expected format: SUBSCRIPTION_ID = your-subscription-id"
        exit 1
    fi
    
    # Validate subscription ID format
    if ! validate_subscription_id "$NEW_SUBSCRIPTION_ID"; then
        print_error "Invalid subscription ID format: '$NEW_SUBSCRIPTION_ID'"
        print_status "Expected format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        exit 1
    fi
    
    print_success "Found subscription ID: $NEW_SUBSCRIPTION_ID"
    
    # Check if roles directory exists
    if [[ ! -d "$ROLES_DIR" ]]; then
        print_error "Roles directory '$ROLES_DIR' not found!"
        exit 1
    fi
    
    # Find JSON files in roles directory
    local json_files=($(find "$ROLES_DIR" -name "*.json" -type f))
    
    if [[ ${#json_files[@]} -eq 0 ]]; then
        print_warning "No JSON files found in '$ROLES_DIR' directory"
        exit 0
    fi
    
    print_status "Found ${#json_files[@]} JSON files to process"
    print_status "Files to process:"
    for i in "${!json_files[@]}"; do
        print_status "  [$((i+1))] ${json_files[i]}"
    done
    echo
    
    # Process each JSON file
    local files_processed=0
    for file in "${json_files[@]}"; do
        if [[ -f "$file" ]]; then
            echo "----------------------------------------"
            print_status "Processing file $((files_processed + 1)) of ${#json_files[@]}: $file"
            
            # Process file and continue even if it fails
            if update_subscription_in_file "$file" "$NEW_SUBSCRIPTION_ID"; then
                print_success "Successfully processed: $file"
            else
                print_error "Failed to process: $file (continuing with next file)"
            fi
            
            ((files_processed++))
            
            # Show changes if requested
            if [[ "${1:-}" == "--show-diff" ]]; then
                show_changes "$file"
            fi
        else
            print_warning "File not found: $file"
        fi
    done
    
    echo
    print_success "Completed! Processed $files_processed JSON files"
    
    # Summary
    echo
    print_status "Summary:"
    echo "  • Environment file: $ENV_FILE"
    echo "  • New subscription ID: $NEW_SUBSCRIPTION_ID"
    echo "  • Files processed: $files_processed"
    echo "  • Backup files created with '$BACKUP_SUFFIX' suffix"
    
    # Always try to cleanup backups (even if no files were actually changed)
    cleanup_backups
}

# Help function
show_help() {
    echo "Azure Role Subscription ID Updater"
    echo
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  --show-diff    Show differences between old and new files"
    echo "  --help, -h     Show this help message"
    echo
    echo "Description:"
    echo "  Reads SUBSCRIPTION_ID from '$ENV_FILE' and updates all JSON files"
    echo "  in '$ROLES_DIR' directory, replacing subscription IDs in AssignableScopes."
    echo
    echo "Requirements:"
    echo "  • '$ENV_FILE' file with SUBSCRIPTION_ID = your-subscription-id"
    echo "  • '$ROLES_DIR' directory with JSON role definition files"
    echo
    echo "Example '$ENV_FILE':"
    echo "  SUBSCRIPTION_ID = cdaddc8f-3ad6-4b69-ae98-bfeae5609265"
    echo "  RESOURCE_GROUP = geni-jhipster-rg"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac