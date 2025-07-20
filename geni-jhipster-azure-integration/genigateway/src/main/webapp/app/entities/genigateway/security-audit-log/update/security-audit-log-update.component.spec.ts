import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SecurityAuditLogService } from '../service/security-audit-log.service';
import { ISecurityAuditLog } from '../security-audit-log.model';
import { SecurityAuditLogFormService } from './security-audit-log-form.service';

import { SecurityAuditLogUpdateComponent } from './security-audit-log-update.component';

describe('SecurityAuditLog Management Update Component', () => {
  let comp: SecurityAuditLogUpdateComponent;
  let fixture: ComponentFixture<SecurityAuditLogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let securityAuditLogFormService: SecurityAuditLogFormService;
  let securityAuditLogService: SecurityAuditLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SecurityAuditLogUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SecurityAuditLogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SecurityAuditLogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    securityAuditLogFormService = TestBed.inject(SecurityAuditLogFormService);
    securityAuditLogService = TestBed.inject(SecurityAuditLogService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const securityAuditLog: ISecurityAuditLog = { id: 456 };

      activatedRoute.data = of({ securityAuditLog });
      comp.ngOnInit();

      expect(comp.securityAuditLog).toEqual(securityAuditLog);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISecurityAuditLog>>();
      const securityAuditLog = { id: 123 };
      jest.spyOn(securityAuditLogFormService, 'getSecurityAuditLog').mockReturnValue(securityAuditLog);
      jest.spyOn(securityAuditLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ securityAuditLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: securityAuditLog }));
      saveSubject.complete();

      // THEN
      expect(securityAuditLogFormService.getSecurityAuditLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(securityAuditLogService.update).toHaveBeenCalledWith(expect.objectContaining(securityAuditLog));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISecurityAuditLog>>();
      const securityAuditLog = { id: 123 };
      jest.spyOn(securityAuditLogFormService, 'getSecurityAuditLog').mockReturnValue({ id: null });
      jest.spyOn(securityAuditLogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ securityAuditLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: securityAuditLog }));
      saveSubject.complete();

      // THEN
      expect(securityAuditLogFormService.getSecurityAuditLog).toHaveBeenCalled();
      expect(securityAuditLogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISecurityAuditLog>>();
      const securityAuditLog = { id: 123 };
      jest.spyOn(securityAuditLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ securityAuditLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(securityAuditLogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
