import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ISecurityAuditLog } from '../security-audit-log.model';
import { SecurityAuditLogService } from '../service/security-audit-log.service';

import securityAuditLogResolve from './security-audit-log-routing-resolve.service';

describe('SecurityAuditLog routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: SecurityAuditLogService;
  let resultSecurityAuditLog: ISecurityAuditLog | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(SecurityAuditLogService);
    resultSecurityAuditLog = undefined;
  });

  describe('resolve', () => {
    it('should return ISecurityAuditLog returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        securityAuditLogResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSecurityAuditLog = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSecurityAuditLog).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        securityAuditLogResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSecurityAuditLog = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultSecurityAuditLog).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ISecurityAuditLog>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        securityAuditLogResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSecurityAuditLog = result;
          },
        });
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultSecurityAuditLog).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
