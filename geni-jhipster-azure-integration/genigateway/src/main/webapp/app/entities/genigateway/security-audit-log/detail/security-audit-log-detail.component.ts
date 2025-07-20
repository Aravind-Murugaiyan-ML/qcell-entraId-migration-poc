import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISecurityAuditLog } from '../security-audit-log.model';

@Component({
  standalone: true,
  selector: 'geni-security-audit-log-detail',
  templateUrl: './security-audit-log-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SecurityAuditLogDetailComponent {
  @Input() securityAuditLog: ISecurityAuditLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
