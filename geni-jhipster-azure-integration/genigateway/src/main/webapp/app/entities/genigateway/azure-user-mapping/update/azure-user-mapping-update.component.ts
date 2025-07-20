import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IAzureUserMapping } from '../azure-user-mapping.model';
import { AzureUserMappingService } from '../service/azure-user-mapping.service';
import { AzureUserMappingFormService, AzureUserMappingFormGroup } from './azure-user-mapping-form.service';

@Component({
  standalone: true,
  selector: 'geni-azure-user-mapping-update',
  templateUrl: './azure-user-mapping-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AzureUserMappingUpdateComponent implements OnInit {
  isSaving = false;
  azureUserMapping: IAzureUserMapping | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: AzureUserMappingFormGroup = this.azureUserMappingFormService.createAzureUserMappingFormGroup();

  constructor(
    protected azureUserMappingService: AzureUserMappingService,
    protected azureUserMappingFormService: AzureUserMappingFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ azureUserMapping }) => {
      this.azureUserMapping = azureUserMapping;
      if (azureUserMapping) {
        this.updateForm(azureUserMapping);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const azureUserMapping = this.azureUserMappingFormService.getAzureUserMapping(this.editForm);
    if (azureUserMapping.id !== null) {
      this.subscribeToSaveResponse(this.azureUserMappingService.update(azureUserMapping));
    } else {
      this.subscribeToSaveResponse(this.azureUserMappingService.create(azureUserMapping));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAzureUserMapping>>): void {
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

  protected updateForm(azureUserMapping: IAzureUserMapping): void {
    this.azureUserMapping = azureUserMapping;
    this.azureUserMappingFormService.resetForm(this.editForm, azureUserMapping);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, azureUserMapping.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.azureUserMapping?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
