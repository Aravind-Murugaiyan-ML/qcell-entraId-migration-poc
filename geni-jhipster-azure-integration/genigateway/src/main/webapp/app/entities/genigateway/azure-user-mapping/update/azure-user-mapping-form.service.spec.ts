import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../azure-user-mapping.test-samples';

import { AzureUserMappingFormService } from './azure-user-mapping-form.service';

describe('AzureUserMapping Form Service', () => {
  let service: AzureUserMappingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureUserMappingFormService);
  });

  describe('Service methods', () => {
    describe('createAzureUserMappingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAzureUserMappingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            azureObjectId: expect.any(Object),
            azureUpn: expect.any(Object),
            displayName: expect.any(Object),
            email: expect.any(Object),
            department: expect.any(Object),
            jobTitle: expect.any(Object),
            isActive: expect.any(Object),
            lastLogin: expect.any(Object),
            loginCount: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IAzureUserMapping should create a new form with FormGroup', () => {
        const formGroup = service.createAzureUserMappingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            azureObjectId: expect.any(Object),
            azureUpn: expect.any(Object),
            displayName: expect.any(Object),
            email: expect.any(Object),
            department: expect.any(Object),
            jobTitle: expect.any(Object),
            isActive: expect.any(Object),
            lastLogin: expect.any(Object),
            loginCount: expect.any(Object),
            createdAt: expect.any(Object),
            updatedAt: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getAzureUserMapping', () => {
      it('should return NewAzureUserMapping for default AzureUserMapping initial value', () => {
        const formGroup = service.createAzureUserMappingFormGroup(sampleWithNewData);

        const azureUserMapping = service.getAzureUserMapping(formGroup) as any;

        expect(azureUserMapping).toMatchObject(sampleWithNewData);
      });

      it('should return NewAzureUserMapping for empty AzureUserMapping initial value', () => {
        const formGroup = service.createAzureUserMappingFormGroup();

        const azureUserMapping = service.getAzureUserMapping(formGroup) as any;

        expect(azureUserMapping).toMatchObject({});
      });

      it('should return IAzureUserMapping', () => {
        const formGroup = service.createAzureUserMappingFormGroup(sampleWithRequiredData);

        const azureUserMapping = service.getAzureUserMapping(formGroup) as any;

        expect(azureUserMapping).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAzureUserMapping should not enable id FormControl', () => {
        const formGroup = service.createAzureUserMappingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAzureUserMapping should disable id FormControl', () => {
        const formGroup = service.createAzureUserMappingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
