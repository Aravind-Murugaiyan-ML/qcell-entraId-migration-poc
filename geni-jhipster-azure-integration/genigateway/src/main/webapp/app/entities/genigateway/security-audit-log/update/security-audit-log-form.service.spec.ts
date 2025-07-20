import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../security-audit-log.test-samples';

import { SecurityAuditLogFormService } from './security-audit-log-form.service';

describe('SecurityAuditLog Form Service', () => {
  let service: SecurityAuditLogFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityAuditLogFormService);
  });

  describe('Service methods', () => {
    describe('createSecurityAuditLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSecurityAuditLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            eventType: expect.any(Object),
            resourceType: expect.any(Object),
            resourceId: expect.any(Object),
            action: expect.any(Object),
            result: expect.any(Object),
            timestamp: expect.any(Object),
          }),
        );
      });

      it('passing ISecurityAuditLog should create a new form with FormGroup', () => {
        const formGroup = service.createSecurityAuditLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            userId: expect.any(Object),
            eventType: expect.any(Object),
            resourceType: expect.any(Object),
            resourceId: expect.any(Object),
            action: expect.any(Object),
            result: expect.any(Object),
            timestamp: expect.any(Object),
          }),
        );
      });
    });

    describe('getSecurityAuditLog', () => {
      it('should return NewSecurityAuditLog for default SecurityAuditLog initial value', () => {
        const formGroup = service.createSecurityAuditLogFormGroup(sampleWithNewData);

        const securityAuditLog = service.getSecurityAuditLog(formGroup) as any;

        expect(securityAuditLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewSecurityAuditLog for empty SecurityAuditLog initial value', () => {
        const formGroup = service.createSecurityAuditLogFormGroup();

        const securityAuditLog = service.getSecurityAuditLog(formGroup) as any;

        expect(securityAuditLog).toMatchObject({});
      });

      it('should return ISecurityAuditLog', () => {
        const formGroup = service.createSecurityAuditLogFormGroup(sampleWithRequiredData);

        const securityAuditLog = service.getSecurityAuditLog(formGroup) as any;

        expect(securityAuditLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISecurityAuditLog should not enable id FormControl', () => {
        const formGroup = service.createSecurityAuditLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSecurityAuditLog should disable id FormControl', () => {
        const formGroup = service.createSecurityAuditLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
