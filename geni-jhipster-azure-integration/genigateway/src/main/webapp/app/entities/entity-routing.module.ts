import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'azure-user-mapping',
        data: { pageTitle: 'genigatewayApp.genigatewayAzureUserMapping.home.title' },
        loadChildren: () => import('./genigateway/azure-user-mapping/azure-user-mapping.routes'),
      },
      {
        path: 'security-audit-log',
        data: { pageTitle: 'genigatewayApp.genigatewaySecurityAuditLog.home.title' },
        loadChildren: () => import('./genigateway/security-audit-log/security-audit-log.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
