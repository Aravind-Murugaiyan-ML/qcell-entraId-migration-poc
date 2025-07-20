import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISecurityAuditLog, NewSecurityAuditLog } from '../security-audit-log.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISecurityAuditLog for edit and NewSecurityAuditLogFormGroupInput for create.
 */
type SecurityAuditLogFormGroupInput = ISecurityAuditLog | PartialWithRequiredKeyOf<NewSecurityAuditLog>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISecurityAuditLog | NewSecurityAuditLog> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type SecurityAuditLogFormRawValue = FormValueOf<ISecurityAuditLog>;

type NewSecurityAuditLogFormRawValue = FormValueOf<NewSecurityAuditLog>;

type SecurityAuditLogFormDefaults = Pick<NewSecurityAuditLog, 'id' | 'timestamp'>;

type SecurityAuditLogFormGroupContent = {
  id: FormControl<SecurityAuditLogFormRawValue['id'] | NewSecurityAuditLog['id']>;
  userId: FormControl<SecurityAuditLogFormRawValue['userId']>;
  eventType: FormControl<SecurityAuditLogFormRawValue['eventType']>;
  resourceType: FormControl<SecurityAuditLogFormRawValue['resourceType']>;
  resourceId: FormControl<SecurityAuditLogFormRawValue['resourceId']>;
  action: FormControl<SecurityAuditLogFormRawValue['action']>;
  result: FormControl<SecurityAuditLogFormRawValue['result']>;
  timestamp: FormControl<SecurityAuditLogFormRawValue['timestamp']>;
};

export type SecurityAuditLogFormGroup = FormGroup<SecurityAuditLogFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SecurityAuditLogFormService {
  createSecurityAuditLogFormGroup(securityAuditLog: SecurityAuditLogFormGroupInput = { id: null }): SecurityAuditLogFormGroup {
    const securityAuditLogRawValue = this.convertSecurityAuditLogToSecurityAuditLogRawValue({
      ...this.getFormDefaults(),
      ...securityAuditLog,
    });
    return new FormGroup<SecurityAuditLogFormGroupContent>({
      id: new FormControl(
        { value: securityAuditLogRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      userId: new FormControl(securityAuditLogRawValue.userId),
      eventType: new FormControl(securityAuditLogRawValue.eventType),
      resourceType: new FormControl(securityAuditLogRawValue.resourceType),
      resourceId: new FormControl(securityAuditLogRawValue.resourceId),
      action: new FormControl(securityAuditLogRawValue.action),
      result: new FormControl(securityAuditLogRawValue.result),
      timestamp: new FormControl(securityAuditLogRawValue.timestamp),
    });
  }

  getSecurityAuditLog(form: SecurityAuditLogFormGroup): ISecurityAuditLog | NewSecurityAuditLog {
    return this.convertSecurityAuditLogRawValueToSecurityAuditLog(
      form.getRawValue() as SecurityAuditLogFormRawValue | NewSecurityAuditLogFormRawValue,
    );
  }

  resetForm(form: SecurityAuditLogFormGroup, securityAuditLog: SecurityAuditLogFormGroupInput): void {
    const securityAuditLogRawValue = this.convertSecurityAuditLogToSecurityAuditLogRawValue({
      ...this.getFormDefaults(),
      ...securityAuditLog,
    });
    form.reset(
      {
        ...securityAuditLogRawValue,
        id: { value: securityAuditLogRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SecurityAuditLogFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertSecurityAuditLogRawValueToSecurityAuditLog(
    rawSecurityAuditLog: SecurityAuditLogFormRawValue | NewSecurityAuditLogFormRawValue,
  ): ISecurityAuditLog | NewSecurityAuditLog {
    return {
      ...rawSecurityAuditLog,
      timestamp: dayjs(rawSecurityAuditLog.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertSecurityAuditLogToSecurityAuditLogRawValue(
    securityAuditLog: ISecurityAuditLog | (Partial<NewSecurityAuditLog> & SecurityAuditLogFormDefaults),
  ): SecurityAuditLogFormRawValue | PartialWithRequiredKeyOf<NewSecurityAuditLogFormRawValue> {
    return {
      ...securityAuditLog,
      timestamp: securityAuditLog.timestamp ? securityAuditLog.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
