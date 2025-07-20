import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('AzureUserMapping e2e test', () => {
  const azureUserMappingPageUrl = '/azure-user-mapping';
  const azureUserMappingPageUrlPattern = new RegExp('/azure-user-mapping(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const azureUserMappingSample = { azureObjectId: 'elegant up gee', azureUpn: 'squiggly underneath' };

  let azureUserMapping;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/genigateway/api/azure-user-mappings+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/genigateway/api/azure-user-mappings').as('postEntityRequest');
    cy.intercept('DELETE', '/services/genigateway/api/azure-user-mappings/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (azureUserMapping) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/genigateway/api/azure-user-mappings/${azureUserMapping.id}`,
      }).then(() => {
        azureUserMapping = undefined;
      });
    }
  });

  it('AzureUserMappings menu should load AzureUserMappings page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('azure-user-mapping');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AzureUserMapping').should('exist');
    cy.url().should('match', azureUserMappingPageUrlPattern);
  });

  describe('AzureUserMapping page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(azureUserMappingPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AzureUserMapping page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/azure-user-mapping/new$'));
        cy.getEntityCreateUpdateHeading('AzureUserMapping');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', azureUserMappingPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/genigateway/api/azure-user-mappings',
          body: azureUserMappingSample,
        }).then(({ body }) => {
          azureUserMapping = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/genigateway/api/azure-user-mappings+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/genigateway/api/azure-user-mappings?page=0&size=20>; rel="last",<http://localhost/services/genigateway/api/azure-user-mappings?page=0&size=20>; rel="first"',
              },
              body: [azureUserMapping],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(azureUserMappingPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AzureUserMapping page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('azureUserMapping');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', azureUserMappingPageUrlPattern);
      });

      it('edit button click should load edit AzureUserMapping page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AzureUserMapping');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', azureUserMappingPageUrlPattern);
      });

      it('edit button click should load edit AzureUserMapping page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AzureUserMapping');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', azureUserMappingPageUrlPattern);
      });

      it('last delete button click should delete instance of AzureUserMapping', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('azureUserMapping').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', azureUserMappingPageUrlPattern);

        azureUserMapping = undefined;
      });
    });
  });

  describe('new AzureUserMapping page', () => {
    beforeEach(() => {
      cy.visit(`${azureUserMappingPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AzureUserMapping');
    });

    it('should create an instance of AzureUserMapping', () => {
      cy.get(`[data-cy="azureObjectId"]`).type('where ecliptic');
      cy.get(`[data-cy="azureObjectId"]`).should('have.value', 'where ecliptic');

      cy.get(`[data-cy="azureUpn"]`).type('fooey parameter');
      cy.get(`[data-cy="azureUpn"]`).should('have.value', 'fooey parameter');

      cy.get(`[data-cy="displayName"]`).type('stalk queasily');
      cy.get(`[data-cy="displayName"]`).should('have.value', 'stalk queasily');

      cy.get(`[data-cy="email"]`).type('Oran.Keebler@hotmail.com');
      cy.get(`[data-cy="email"]`).should('have.value', 'Oran.Keebler@hotmail.com');

      cy.get(`[data-cy="department"]`).type('pish droopy');
      cy.get(`[data-cy="department"]`).should('have.value', 'pish droopy');

      cy.get(`[data-cy="jobTitle"]`).type('Future Optimization Engineer');
      cy.get(`[data-cy="jobTitle"]`).should('have.value', 'Future Optimization Engineer');

      cy.get(`[data-cy="isActive"]`).should('not.be.checked');
      cy.get(`[data-cy="isActive"]`).click();
      cy.get(`[data-cy="isActive"]`).should('be.checked');

      cy.get(`[data-cy="lastLogin"]`).type('2025-07-20T00:43');
      cy.get(`[data-cy="lastLogin"]`).blur();
      cy.get(`[data-cy="lastLogin"]`).should('have.value', '2025-07-20T00:43');

      cy.get(`[data-cy="loginCount"]`).type('16861');
      cy.get(`[data-cy="loginCount"]`).should('have.value', '16861');

      cy.get(`[data-cy="createdAt"]`).type('2025-07-20T09:34');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2025-07-20T09:34');

      cy.get(`[data-cy="updatedAt"]`).type('2025-07-19T16:57');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2025-07-19T16:57');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        azureUserMapping = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', azureUserMappingPageUrlPattern);
    });
  });
});
