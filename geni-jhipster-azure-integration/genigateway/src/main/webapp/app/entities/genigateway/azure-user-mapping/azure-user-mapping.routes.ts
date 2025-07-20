import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AzureUserMappingComponent } from './list/azure-user-mapping.component';
import { AzureUserMappingDetailComponent } from './detail/azure-user-mapping-detail.component';
import { AzureUserMappingUpdateComponent } from './update/azure-user-mapping-update.component';
import AzureUserMappingResolve from './route/azure-user-mapping-routing-resolve.service';

const azureUserMappingRoute: Routes = [
  {
    path: '',
    component: AzureUserMappingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AzureUserMappingDetailComponent,
    resolve: {
      azureUserMapping: AzureUserMappingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AzureUserMappingUpdateComponent,
    resolve: {
      azureUserMapping: AzureUserMappingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AzureUserMappingUpdateComponent,
    resolve: {
      azureUserMapping: AzureUserMappingResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default azureUserMappingRoute;
