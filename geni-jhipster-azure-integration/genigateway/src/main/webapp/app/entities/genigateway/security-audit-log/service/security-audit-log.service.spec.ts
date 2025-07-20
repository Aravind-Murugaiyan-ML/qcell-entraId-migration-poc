import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISecurityAuditLog } from '../security-audit-log.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../security-audit-log.test-samples';

import { SecurityAuditLogService, RestSecurityAuditLog } from './security-audit-log.service';

const requireRestSample: RestSecurityAuditLog = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('SecurityAuditLog Service', () => {
  let service: SecurityAuditLogService;
  let httpMock: HttpTestingController;
  let expectedResult: ISecurityAuditLog | ISecurityAuditLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SecurityAuditLogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SecurityAuditLog', () => {
      const securityAuditLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(securityAuditLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SecurityAuditLog', () => {
      const securityAuditLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(securityAuditLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SecurityAuditLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SecurityAuditLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SecurityAuditLog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSecurityAuditLogToCollectionIfMissing', () => {
      it('should add a SecurityAuditLog to an empty array', () => {
        const securityAuditLog: ISecurityAuditLog = sampleWithRequiredData;
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing([], securityAuditLog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(securityAuditLog);
      });

      it('should not add a SecurityAuditLog to an array that contains it', () => {
        const securityAuditLog: ISecurityAuditLog = sampleWithRequiredData;
        const securityAuditLogCollection: ISecurityAuditLog[] = [
          {
            ...securityAuditLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing(securityAuditLogCollection, securityAuditLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SecurityAuditLog to an array that doesn't contain it", () => {
        const securityAuditLog: ISecurityAuditLog = sampleWithRequiredData;
        const securityAuditLogCollection: ISecurityAuditLog[] = [sampleWithPartialData];
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing(securityAuditLogCollection, securityAuditLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(securityAuditLog);
      });

      it('should add only unique SecurityAuditLog to an array', () => {
        const securityAuditLogArray: ISecurityAuditLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const securityAuditLogCollection: ISecurityAuditLog[] = [sampleWithRequiredData];
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing(securityAuditLogCollection, ...securityAuditLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const securityAuditLog: ISecurityAuditLog = sampleWithRequiredData;
        const securityAuditLog2: ISecurityAuditLog = sampleWithPartialData;
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing([], securityAuditLog, securityAuditLog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(securityAuditLog);
        expect(expectedResult).toContain(securityAuditLog2);
      });

      it('should accept null and undefined values', () => {
        const securityAuditLog: ISecurityAuditLog = sampleWithRequiredData;
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing([], null, securityAuditLog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(securityAuditLog);
      });

      it('should return initial array if no SecurityAuditLog is added', () => {
        const securityAuditLogCollection: ISecurityAuditLog[] = [sampleWithRequiredData];
        expectedResult = service.addSecurityAuditLogToCollectionIfMissing(securityAuditLogCollection, undefined, null);
        expect(expectedResult).toEqual(securityAuditLogCollection);
      });
    });

    describe('compareSecurityAuditLog', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSecurityAuditLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSecurityAuditLog(entity1, entity2);
        const compareResult2 = service.compareSecurityAuditLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSecurityAuditLog(entity1, entity2);
        const compareResult2 = service.compareSecurityAuditLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSecurityAuditLog(entity1, entity2);
        const compareResult2 = service.compareSecurityAuditLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
