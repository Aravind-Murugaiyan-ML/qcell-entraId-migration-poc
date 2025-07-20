import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SecurityAuditLogDetailComponent } from './security-audit-log-detail.component';

describe('SecurityAuditLog Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAuditLogDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SecurityAuditLogDetailComponent,
              resolve: { securityAuditLog: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SecurityAuditLogDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load securityAuditLog on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SecurityAuditLogDetailComponent);

      // THEN
      expect(instance.securityAuditLog).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
