import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAzureUserMapping, NewAzureUserMapping } from '../azure-user-mapping.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAzureUserMapping for edit and NewAzureUserMappingFormGroupInput for create.
 */
type AzureUserMappingFormGroupInput = IAzureUserMapping | PartialWithRequiredKeyOf<NewAzureUserMapping>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAzureUserMapping | NewAzureUserMapping> = Omit<T, 'lastLogin' | 'createdAt' | 'updatedAt'> & {
  lastLogin?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type AzureUserMappingFormRawValue = FormValueOf<IAzureUserMapping>;

type NewAzureUserMappingFormRawValue = FormValueOf<NewAzureUserMapping>;

type AzureUserMappingFormDefaults = Pick<NewAzureUserMapping, 'id' | 'isActive' | 'lastLogin' | 'createdAt' | 'updatedAt'>;

type AzureUserMappingFormGroupContent = {
  id: FormControl<AzureUserMappingFormRawValue['id'] | NewAzureUserMapping['id']>;
  azureObjectId: FormControl<AzureUserMappingFormRawValue['azureObjectId']>;
  azureUpn: FormControl<AzureUserMappingFormRawValue['azureUpn']>;
  displayName: FormControl<AzureUserMappingFormRawValue['displayName']>;
  email: FormControl<AzureUserMappingFormRawValue['email']>;
  department: FormControl<AzureUserMappingFormRawValue['department']>;
  jobTitle: FormControl<AzureUserMappingFormRawValue['jobTitle']>;
  isActive: FormControl<AzureUserMappingFormRawValue['isActive']>;
  lastLogin: FormControl<AzureUserMappingFormRawValue['lastLogin']>;
  loginCount: FormControl<AzureUserMappingFormRawValue['loginCount']>;
  createdAt: FormControl<AzureUserMappingFormRawValue['createdAt']>;
  updatedAt: FormControl<AzureUserMappingFormRawValue['updatedAt']>;
  user: FormControl<AzureUserMappingFormRawValue['user']>;
};

export type AzureUserMappingFormGroup = FormGroup<AzureUserMappingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AzureUserMappingFormService {
  createAzureUserMappingFormGroup(azureUserMapping: AzureUserMappingFormGroupInput = { id: null }): AzureUserMappingFormGroup {
    const azureUserMappingRawValue = this.convertAzureUserMappingToAzureUserMappingRawValue({
      ...this.getFormDefaults(),
      ...azureUserMapping,
    });
    return new FormGroup<AzureUserMappingFormGroupContent>({
      id: new FormControl(
        { value: azureUserMappingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      azureObjectId: new FormControl(azureUserMappingRawValue.azureObjectId, {
        validators: [Validators.required],
      }),
      azureUpn: new FormControl(azureUserMappingRawValue.azureUpn, {
        validators: [Validators.required],
      }),
      displayName: new FormControl(azureUserMappingRawValue.displayName),
      email: new FormControl(azureUserMappingRawValue.email),
      department: new FormControl(azureUserMappingRawValue.department),
      jobTitle: new FormControl(azureUserMappingRawValue.jobTitle),
      isActive: new FormControl(azureUserMappingRawValue.isActive),
      lastLogin: new FormControl(azureUserMappingRawValue.lastLogin),
      loginCount: new FormControl(azureUserMappingRawValue.loginCount),
      createdAt: new FormControl(azureUserMappingRawValue.createdAt),
      updatedAt: new FormControl(azureUserMappingRawValue.updatedAt),
      user: new FormControl(azureUserMappingRawValue.user),
    });
  }

  getAzureUserMapping(form: AzureUserMappingFormGroup): IAzureUserMapping | NewAzureUserMapping {
    return this.convertAzureUserMappingRawValueToAzureUserMapping(
      form.getRawValue() as AzureUserMappingFormRawValue | NewAzureUserMappingFormRawValue,
    );
  }

  resetForm(form: AzureUserMappingFormGroup, azureUserMapping: AzureUserMappingFormGroupInput): void {
    const azureUserMappingRawValue = this.convertAzureUserMappingToAzureUserMappingRawValue({
      ...this.getFormDefaults(),
      ...azureUserMapping,
    });
    form.reset(
      {
        ...azureUserMappingRawValue,
        id: { value: azureUserMappingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AzureUserMappingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isActive: false,
      lastLogin: currentTime,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
  }

  private convertAzureUserMappingRawValueToAzureUserMapping(
    rawAzureUserMapping: AzureUserMappingFormRawValue | NewAzureUserMappingFormRawValue,
  ): IAzureUserMapping | NewAzureUserMapping {
    return {
      ...rawAzureUserMapping,
      lastLogin: dayjs(rawAzureUserMapping.lastLogin, DATE_TIME_FORMAT),
      createdAt: dayjs(rawAzureUserMapping.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawAzureUserMapping.updatedAt, DATE_TIME_FORMAT),
    };
  }

  private convertAzureUserMappingToAzureUserMappingRawValue(
    azureUserMapping: IAzureUserMapping | (Partial<NewAzureUserMapping> & AzureUserMappingFormDefaults),
  ): AzureUserMappingFormRawValue | PartialWithRequiredKeyOf<NewAzureUserMappingFormRawValue> {
    return {
      ...azureUserMapping,
      lastLogin: azureUserMapping.lastLogin ? azureUserMapping.lastLogin.format(DATE_TIME_FORMAT) : undefined,
      createdAt: azureUserMapping.createdAt ? azureUserMapping.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: azureUserMapping.updatedAt ? azureUserMapping.updatedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
