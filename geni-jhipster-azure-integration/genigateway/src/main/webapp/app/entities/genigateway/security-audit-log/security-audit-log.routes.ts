import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SecurityAuditLogComponent } from './list/security-audit-log.component';
import { SecurityAuditLogDetailComponent } from './detail/security-audit-log-detail.component';
import { SecurityAuditLogUpdateComponent } from './update/security-audit-log-update.component';
import SecurityAuditLogResolve from './route/security-audit-log-routing-resolve.service';

const securityAuditLogRoute: Routes = [
  {
    path: '',
    component: SecurityAuditLogComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SecurityAuditLogDetailComponent,
    resolve: {
      securityAuditLog: SecurityAuditLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SecurityAuditLogUpdateComponent,
    resolve: {
      securityAuditLog: SecurityAuditLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SecurityAuditLogUpdateComponent,
    resolve: {
      securityAuditLog: SecurityAuditLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default securityAuditLogRoute;
