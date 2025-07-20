import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISecurityAuditLog, NewSecurityAuditLog } from '../security-audit-log.model';

export type PartialUpdateSecurityAuditLog = Partial<ISecurityAuditLog> & Pick<ISecurityAuditLog, 'id'>;

type RestOf<T extends ISecurityAuditLog | NewSecurityAuditLog> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestSecurityAuditLog = RestOf<ISecurityAuditLog>;

export type NewRestSecurityAuditLog = RestOf<NewSecurityAuditLog>;

export type PartialUpdateRestSecurityAuditLog = RestOf<PartialUpdateSecurityAuditLog>;

export type EntityResponseType = HttpResponse<ISecurityAuditLog>;
export type EntityArrayResponseType = HttpResponse<ISecurityAuditLog[]>;

@Injectable({ providedIn: 'root' })
export class SecurityAuditLogService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/security-audit-logs', 'genigateway');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(securityAuditLog: NewSecurityAuditLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(securityAuditLog);
    return this.http
      .post<RestSecurityAuditLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(securityAuditLog: ISecurityAuditLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(securityAuditLog);
    return this.http
      .put<RestSecurityAuditLog>(`${this.resourceUrl}/${this.getSecurityAuditLogIdentifier(securityAuditLog)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(securityAuditLog: PartialUpdateSecurityAuditLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(securityAuditLog);
    return this.http
      .patch<RestSecurityAuditLog>(`${this.resourceUrl}/${this.getSecurityAuditLogIdentifier(securityAuditLog)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSecurityAuditLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSecurityAuditLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSecurityAuditLogIdentifier(securityAuditLog: Pick<ISecurityAuditLog, 'id'>): number {
    return securityAuditLog.id;
  }

  compareSecurityAuditLog(o1: Pick<ISecurityAuditLog, 'id'> | null, o2: Pick<ISecurityAuditLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getSecurityAuditLogIdentifier(o1) === this.getSecurityAuditLogIdentifier(o2) : o1 === o2;
  }

  addSecurityAuditLogToCollectionIfMissing<Type extends Pick<ISecurityAuditLog, 'id'>>(
    securityAuditLogCollection: Type[],
    ...securityAuditLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const securityAuditLogs: Type[] = securityAuditLogsToCheck.filter(isPresent);
    if (securityAuditLogs.length > 0) {
      const securityAuditLogCollectionIdentifiers = securityAuditLogCollection.map(
        securityAuditLogItem => this.getSecurityAuditLogIdentifier(securityAuditLogItem)!,
      );
      const securityAuditLogsToAdd = securityAuditLogs.filter(securityAuditLogItem => {
        const securityAuditLogIdentifier = this.getSecurityAuditLogIdentifier(securityAuditLogItem);
        if (securityAuditLogCollectionIdentifiers.includes(securityAuditLogIdentifier)) {
          return false;
        }
        securityAuditLogCollectionIdentifiers.push(securityAuditLogIdentifier);
        return true;
      });
      return [...securityAuditLogsToAdd, ...securityAuditLogCollection];
    }
    return securityAuditLogCollection;
  }

  protected convertDateFromClient<T extends ISecurityAuditLog | NewSecurityAuditLog | PartialUpdateSecurityAuditLog>(
    securityAuditLog: T,
  ): RestOf<T> {
    return {
      ...securityAuditLog,
      timestamp: securityAuditLog.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSecurityAuditLog: RestSecurityAuditLog): ISecurityAuditLog {
    return {
      ...restSecurityAuditLog,
      timestamp: restSecurityAuditLog.timestamp ? dayjs(restSecurityAuditLog.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSecurityAuditLog>): HttpResponse<ISecurityAuditLog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSecurityAuditLog[]>): HttpResponse<ISecurityAuditLog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
