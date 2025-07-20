import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAzureUserMapping } from '../azure-user-mapping.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../azure-user-mapping.test-samples';

import { AzureUserMappingService, RestAzureUserMapping } from './azure-user-mapping.service';

const requireRestSample: RestAzureUserMapping = {
  ...sampleWithRequiredData,
  lastLogin: sampleWithRequiredData.lastLogin?.toJSON(),
  createdAt: sampleWithRequiredData.createdAt?.toJSON(),
  updatedAt: sampleWithRequiredData.updatedAt?.toJSON(),
};

describe('AzureUserMapping Service', () => {
  let service: AzureUserMappingService;
  let httpMock: HttpTestingController;
  let expectedResult: IAzureUserMapping | IAzureUserMapping[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AzureUserMappingService);
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

    it('should create a AzureUserMapping', () => {
      const azureUserMapping = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(azureUserMapping).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AzureUserMapping', () => {
      const azureUserMapping = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(azureUserMapping).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AzureUserMapping', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AzureUserMapping', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AzureUserMapping', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAzureUserMappingToCollectionIfMissing', () => {
      it('should add a AzureUserMapping to an empty array', () => {
        const azureUserMapping: IAzureUserMapping = sampleWithRequiredData;
        expectedResult = service.addAzureUserMappingToCollectionIfMissing([], azureUserMapping);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(azureUserMapping);
      });

      it('should not add a AzureUserMapping to an array that contains it', () => {
        const azureUserMapping: IAzureUserMapping = sampleWithRequiredData;
        const azureUserMappingCollection: IAzureUserMapping[] = [
          {
            ...azureUserMapping,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAzureUserMappingToCollectionIfMissing(azureUserMappingCollection, azureUserMapping);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AzureUserMapping to an array that doesn't contain it", () => {
        const azureUserMapping: IAzureUserMapping = sampleWithRequiredData;
        const azureUserMappingCollection: IAzureUserMapping[] = [sampleWithPartialData];
        expectedResult = service.addAzureUserMappingToCollectionIfMissing(azureUserMappingCollection, azureUserMapping);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(azureUserMapping);
      });

      it('should add only unique AzureUserMapping to an array', () => {
        const azureUserMappingArray: IAzureUserMapping[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const azureUserMappingCollection: IAzureUserMapping[] = [sampleWithRequiredData];
        expectedResult = service.addAzureUserMappingToCollectionIfMissing(azureUserMappingCollection, ...azureUserMappingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const azureUserMapping: IAzureUserMapping = sampleWithRequiredData;
        const azureUserMapping2: IAzureUserMapping = sampleWithPartialData;
        expectedResult = service.addAzureUserMappingToCollectionIfMissing([], azureUserMapping, azureUserMapping2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(azureUserMapping);
        expect(expectedResult).toContain(azureUserMapping2);
      });

      it('should accept null and undefined values', () => {
        const azureUserMapping: IAzureUserMapping = sampleWithRequiredData;
        expectedResult = service.addAzureUserMappingToCollectionIfMissing([], null, azureUserMapping, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(azureUserMapping);
      });

      it('should return initial array if no AzureUserMapping is added', () => {
        const azureUserMappingCollection: IAzureUserMapping[] = [sampleWithRequiredData];
        expectedResult = service.addAzureUserMappingToCollectionIfMissing(azureUserMappingCollection, undefined, null);
        expect(expectedResult).toEqual(azureUserMappingCollection);
      });
    });

    describe('compareAzureUserMapping', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAzureUserMapping(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAzureUserMapping(entity1, entity2);
        const compareResult2 = service.compareAzureUserMapping(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAzureUserMapping(entity1, entity2);
        const compareResult2 = service.compareAzureUserMapping(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAzureUserMapping(entity1, entity2);
        const compareResult2 = service.compareAzureUserMapping(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
