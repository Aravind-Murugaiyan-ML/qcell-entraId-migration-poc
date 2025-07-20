import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAzureUserMapping, NewAzureUserMapping } from '../azure-user-mapping.model';

export type PartialUpdateAzureUserMapping = Partial<IAzureUserMapping> & Pick<IAzureUserMapping, 'id'>;

type RestOf<T extends IAzureUserMapping | NewAzureUserMapping> = Omit<T, 'lastLogin' | 'createdAt' | 'updatedAt'> & {
  lastLogin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RestAzureUserMapping = RestOf<IAzureUserMapping>;

export type NewRestAzureUserMapping = RestOf<NewAzureUserMapping>;

export type PartialUpdateRestAzureUserMapping = RestOf<PartialUpdateAzureUserMapping>;

export type EntityResponseType = HttpResponse<IAzureUserMapping>;
export type EntityArrayResponseType = HttpResponse<IAzureUserMapping[]>;

@Injectable({ providedIn: 'root' })
export class AzureUserMappingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/azure-user-mappings', 'genigateway');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(azureUserMapping: NewAzureUserMapping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(azureUserMapping);
    return this.http
      .post<RestAzureUserMapping>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(azureUserMapping: IAzureUserMapping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(azureUserMapping);
    return this.http
      .put<RestAzureUserMapping>(`${this.resourceUrl}/${this.getAzureUserMappingIdentifier(azureUserMapping)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(azureUserMapping: PartialUpdateAzureUserMapping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(azureUserMapping);
    return this.http
      .patch<RestAzureUserMapping>(`${this.resourceUrl}/${this.getAzureUserMappingIdentifier(azureUserMapping)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAzureUserMapping>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAzureUserMapping[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAzureUserMappingIdentifier(azureUserMapping: Pick<IAzureUserMapping, 'id'>): number {
    return azureUserMapping.id;
  }

  compareAzureUserMapping(o1: Pick<IAzureUserMapping, 'id'> | null, o2: Pick<IAzureUserMapping, 'id'> | null): boolean {
    return o1 && o2 ? this.getAzureUserMappingIdentifier(o1) === this.getAzureUserMappingIdentifier(o2) : o1 === o2;
  }

  addAzureUserMappingToCollectionIfMissing<Type extends Pick<IAzureUserMapping, 'id'>>(
    azureUserMappingCollection: Type[],
    ...azureUserMappingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const azureUserMappings: Type[] = azureUserMappingsToCheck.filter(isPresent);
    if (azureUserMappings.length > 0) {
      const azureUserMappingCollectionIdentifiers = azureUserMappingCollection.map(
        azureUserMappingItem => this.getAzureUserMappingIdentifier(azureUserMappingItem)!,
      );
      const azureUserMappingsToAdd = azureUserMappings.filter(azureUserMappingItem => {
        const azureUserMappingIdentifier = this.getAzureUserMappingIdentifier(azureUserMappingItem);
        if (azureUserMappingCollectionIdentifiers.includes(azureUserMappingIdentifier)) {
          return false;
        }
        azureUserMappingCollectionIdentifiers.push(azureUserMappingIdentifier);
        return true;
      });
      return [...azureUserMappingsToAdd, ...azureUserMappingCollection];
    }
    return azureUserMappingCollection;
  }

  protected convertDateFromClient<T extends IAzureUserMapping | NewAzureUserMapping | PartialUpdateAzureUserMapping>(
    azureUserMapping: T,
  ): RestOf<T> {
    return {
      ...azureUserMapping,
      lastLogin: azureUserMapping.lastLogin?.toJSON() ?? null,
      createdAt: azureUserMapping.createdAt?.toJSON() ?? null,
      updatedAt: azureUserMapping.updatedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAzureUserMapping: RestAzureUserMapping): IAzureUserMapping {
    return {
      ...restAzureUserMapping,
      lastLogin: restAzureUserMapping.lastLogin ? dayjs(restAzureUserMapping.lastLogin) : undefined,
      createdAt: restAzureUserMapping.createdAt ? dayjs(restAzureUserMapping.createdAt) : undefined,
      updatedAt: restAzureUserMapping.updatedAt ? dayjs(restAzureUserMapping.updatedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAzureUserMapping>): HttpResponse<IAzureUserMapping> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAzureUserMapping[]>): HttpResponse<IAzureUserMapping[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
