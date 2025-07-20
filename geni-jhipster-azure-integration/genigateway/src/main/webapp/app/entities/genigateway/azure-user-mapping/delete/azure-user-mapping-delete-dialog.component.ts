import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAzureUserMapping } from '../azure-user-mapping.model';
import { AzureUserMappingService } from '../service/azure-user-mapping.service';

@Component({
  standalone: true,
  templateUrl: './azure-user-mapping-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AzureUserMappingDeleteDialogComponent {
  azureUserMapping?: IAzureUserMapping;

  constructor(
    protected azureUserMappingService: AzureUserMappingService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.azureUserMappingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
