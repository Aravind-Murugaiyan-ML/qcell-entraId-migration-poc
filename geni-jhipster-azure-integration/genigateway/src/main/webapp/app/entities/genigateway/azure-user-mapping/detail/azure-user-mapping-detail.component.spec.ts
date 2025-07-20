import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AzureUserMappingDetailComponent } from './azure-user-mapping-detail.component';

describe('AzureUserMapping Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AzureUserMappingDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AzureUserMappingDetailComponent,
              resolve: { azureUserMapping: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AzureUserMappingDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load azureUserMapping on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AzureUserMappingDetailComponent);

      // THEN
      expect(instance.azureUserMapping).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
