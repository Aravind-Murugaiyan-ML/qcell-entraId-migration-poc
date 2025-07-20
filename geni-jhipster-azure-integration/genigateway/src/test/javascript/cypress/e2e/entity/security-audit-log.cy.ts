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

describe('SecurityAuditLog e2e test', () => {
  const securityAuditLogPageUrl = '/security-audit-log';
  const securityAuditLogPageUrlPattern = new RegExp('/security-audit-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const securityAuditLogSample = {};

  let securityAuditLog;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/genigateway/api/security-audit-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/genigateway/api/security-audit-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/services/genigateway/api/security-audit-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (securityAuditLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/genigateway/api/security-audit-logs/${securityAuditLog.id}`,
      }).then(() => {
        securityAuditLog = undefined;
      });
    }
  });

  it('SecurityAuditLogs menu should load SecurityAuditLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('security-audit-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('SecurityAuditLog').should('exist');
    cy.url().should('match', securityAuditLogPageUrlPattern);
  });

  describe('SecurityAuditLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(securityAuditLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create SecurityAuditLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/security-audit-log/new$'));
        cy.getEntityCreateUpdateHeading('SecurityAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', securityAuditLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/genigateway/api/security-audit-logs',
          body: securityAuditLogSample,
        }).then(({ body }) => {
          securityAuditLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/genigateway/api/security-audit-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/genigateway/api/security-audit-logs?page=0&size=20>; rel="last",<http://localhost/services/genigateway/api/security-audit-logs?page=0&size=20>; rel="first"',
              },
              body: [securityAuditLog],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(securityAuditLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details SecurityAuditLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('securityAuditLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', securityAuditLogPageUrlPattern);
      });

      it('edit button click should load edit SecurityAuditLog page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SecurityAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', securityAuditLogPageUrlPattern);
      });

      it('edit button click should load edit SecurityAuditLog page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('SecurityAuditLog');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', securityAuditLogPageUrlPattern);
      });

      it('last delete button click should delete instance of SecurityAuditLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('securityAuditLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', securityAuditLogPageUrlPattern);

        securityAuditLog = undefined;
      });
    });
  });

  describe('new SecurityAuditLog page', () => {
    beforeEach(() => {
      cy.visit(`${securityAuditLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('SecurityAuditLog');
    });

    it('should create an instance of SecurityAuditLog', () => {
      cy.get(`[data-cy="userId"]`).type('pish big-hearted phew');
      cy.get(`[data-cy="userId"]`).should('have.value', 'pish big-hearted phew');

      cy.get(`[data-cy="eventType"]`).select('DATA_ACCESS');

      cy.get(`[data-cy="resourceType"]`).type('brightly complication toothbrush');
      cy.get(`[data-cy="resourceType"]`).should('have.value', 'brightly complication toothbrush');

      cy.get(`[data-cy="resourceId"]`).type('although');
      cy.get(`[data-cy="resourceId"]`).should('have.value', 'although');

      cy.get(`[data-cy="action"]`).type('noteworthy');
      cy.get(`[data-cy="action"]`).should('have.value', 'noteworthy');

      cy.get(`[data-cy="result"]`).select('SUCCESS');

      cy.get(`[data-cy="timestamp"]`).type('2025-07-20T08:26');
      cy.get(`[data-cy="timestamp"]`).blur();
      cy.get(`[data-cy="timestamp"]`).should('have.value', '2025-07-20T08:26');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        securityAuditLog = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', securityAuditLogPageUrlPattern);
    });
  });
});
