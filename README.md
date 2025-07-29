# qcell-entraId-migration-poc
📋 Listing service principal for 'maktodo JHipster Gateway'...
Name                      Id
------------------------  ------------------------------------
maktodo JHipster Gateway  c93256dc-9e48-4b87-b026-b7f0904c9107
📋 Listing Azure AD App Registration...
az ad app list --display-name "maktodo JHipster Gateway" --query '[].{Name:displayName, AppId:appId}' -o table
Name                      AppId
------------------------  ------------------------------------
maktodo JHipster Gateway  ba309772-9ea9-4749-95eb-93ac5e143f7c
📋 Listing specific resource groups...
az group show --name "mak-todo-jhipster-rg" --query '{Name:name, Location:location}' -o table
Name                  Location
--------------------  ----------
mak-todo-jhipster-rg  eastus
az group show --name "mak-todo-jhipster-prod-rg" --query '{Name:name, Location:location}' -o table
Name                       Location
-------------------------  ----------
mak-todo-jhipster-prod-rg  eastus
✅ Completed listing all Azure resources

📋 Listing Azure AD security groups...
Name                 ID                                    Description
-------------------  ------------------------------------  ---------------------------------------------
GENI-Site-Managers   2b3798a3-2356-4d4e-8d30-827c52535cc4  GENI Site Managers (ROLE_USER + SITE_MANAGER)
GENI-Operators       8345cc67-5d92-4f11-8beb-7345613307cc  GENI Operators (ROLE_USER + OPERATOR)
GENI-Administrators  cc7894de-9991-4a9d-8648-868c37ae743e  GENI JHipster Administrators (ROLE_ADMIN)

📋 Listing custom Azure roles...
Name                Type                                     Description
GENI Administrator  Microsoft.Authorization/roleDefinitions  Full administrative access to GENI JHipster application resources
GENI Site Manager   Microsoft.Authorization/roleDefinitions  Site and device management capabilities for GENI JHipster
GENI Operator       Microsoft.Authorization/roleDefinitions  Read-only access with basic monitoring for GENI JHipster

🔧 Checking Azure CLI session...
✅ Logged in as: aravind-mak-labs@outlook.com
🔧 Setting subscription...
✅ Subscription set to e70bfe2a-26a2-48f9-bed0-06aae13ab61e
📋 GENI Role Assignments:
Resource Group: mak-todo-jhipster-rg

Assignments by Role:
Role: GENI Administrator
User                                             Scope
-----------------------------------------------  ---------------------------------------------------------------------------------------
geniadmin@aravindmaklabsoutlook.onmicrosoft.com  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg

Role: GENI Site Manager
User                                               Scope
-------------------------------------------------  ---------------------------------------------------------------------------------------
genimanager@aravindmaklabsoutlook.onmicrosoft.com  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg

Role: GENI Operator
User                                                Scope
--------------------------------------------------  ---------------------------------------------------------------------------------------
genioperator@aravindmaklabsoutlook.onmicrosoft.com  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg

Assignments by User:
User: geniadmin@aravindmaklabsoutlook.onmicrosoft.com
Role                Scope
------------------  ---------------------------------------------------------------------------------------
GENI Administrator  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg

User: genimanager@aravindmaklabsoutlook.onmicrosoft.com
Role               Scope
-----------------  ---------------------------------------------------------------------------------------
GENI Site Manager  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg

User: genioperator@aravindmaklabsoutlook.onmicrosoft.com
Role           Scope
-------------  ---------------------------------------------------------------------------------------
GENI Operator  /subscriptions/e70bfe2a-26a2-48f9-bed0-06aae13ab61e/resourceGroups/mak-todo-jhipster-rg


