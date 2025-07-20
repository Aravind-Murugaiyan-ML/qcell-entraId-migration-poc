import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SecurityEventType } from 'app/entities/enumerations/security-event-type.model';
import { SecurityResult } from 'app/entities/enumerations/security-result.model';
import { ISecurityAuditLog } from '../security-audit-log.model';
import { SecurityAuditLogService } from '../service/security-audit-log.service';
import { SecurityAuditLogFormService, SecurityAuditLogFormGroup } from './security-audit-log-form.service';

@Component({
  standalone: true,
  selector: 'geni-security-audit-log-update',
  templateUrl: './security-audit-log-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SecurityAuditLogUpdateComponent implements OnInit {
  isSaving = false;
  securityAuditLog: ISecurityAuditLog | null = null;
  securityEventTypeValues = Object.keys(SecurityEventType);
  securityResultValues = Object.keys(SecurityResult);

  editForm: SecurityAuditLogFormGroup = this.securityAuditLogFormService.createSecurityAuditLogFormGroup();

  constructor(
    protected securityAuditLogService: SecurityAuditLogService,
    protected securityAuditLogFormService: SecurityAuditLogFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ securityAuditLog }) => {
      this.securityAuditLog = securityAuditLog;
      if (securityAuditLog) {
        this.updateForm(securityAuditLog);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const securityAuditLog = this.securityAuditLogFormService.getSecurityAuditLog(this.editForm);
    if (securityAuditLog.id !== null) {
      this.subscribeToSaveResponse(this.securityAuditLogService.update(securityAuditLog));
    } else {
      this.subscribeToSaveResponse(this.securityAuditLogService.create(securityAuditLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISecurityAuditLog>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(securityAuditLog: ISecurityAuditLog): void {
    this.securityAuditLog = securityAuditLog;
    this.securityAuditLogFormService.resetForm(this.editForm, securityAuditLog);
  }
}
