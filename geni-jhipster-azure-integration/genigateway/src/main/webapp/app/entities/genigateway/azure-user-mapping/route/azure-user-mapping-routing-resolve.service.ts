import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAzureUserMapping } from '../azure-user-mapping.model';
import { AzureUserMappingService } from '../service/azure-user-mapping.service';

export const azureUserMappingResolve = (route: ActivatedRouteSnapshot): Observable<null | IAzureUserMapping> => {
  const id = route.params['id'];
  if (id) {
    return inject(AzureUserMappingService)
      .find(id)
      .pipe(
        mergeMap((azureUserMapping: HttpResponse<IAzureUserMapping>) => {
          if (azureUserMapping.body) {
            return of(azureUserMapping.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default azureUserMappingResolve;
