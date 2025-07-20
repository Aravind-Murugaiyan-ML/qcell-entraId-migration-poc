import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISecurityAuditLog } from '../security-audit-log.model';
import { SecurityAuditLogService } from '../service/security-audit-log.service';

export const securityAuditLogResolve = (route: ActivatedRouteSnapshot): Observable<null | ISecurityAuditLog> => {
  const id = route.params['id'];
  if (id) {
    return inject(SecurityAuditLogService)
      .find(id)
      .pipe(
        mergeMap((securityAuditLog: HttpResponse<ISecurityAuditLog>) => {
          if (securityAuditLog.body) {
            return of(securityAuditLog.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default securityAuditLogResolve;
