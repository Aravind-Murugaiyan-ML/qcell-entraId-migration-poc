import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { AzureUserMappingService } from '../service/azure-user-mapping.service';
import { IAzureUserMapping } from '../azure-user-mapping.model';

import { AzureUserMappingFormService } from './azure-user-mapping-form.service';

import { AzureUserMappingUpdateComponent } from './azure-user-mapping-update.component';

describe('AzureUserMapping Management Update Component', () => {
  let comp: AzureUserMappingUpdateComponent;
  let fixture: ComponentFixture<AzureUserMappingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let azureUserMappingFormService: AzureUserMappingFormService;
  let azureUserMappingService: AzureUserMappingService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AzureUserMappingUpdateComponent],
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
      .overrideTemplate(AzureUserMappingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AzureUserMappingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    azureUserMappingFormService = TestBed.inject(AzureUserMappingFormService);
    azureUserMappingService = TestBed.inject(AzureUserMappingService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const azureUserMapping: IAzureUserMapping = { id: 456 };
      const user: IUser = { id: '2538aba8-a67b-4a7d-80df-36ebfd3934ea' };
      azureUserMapping.user = user;

      const userCollection: IUser[] = [{ id: '5581fffa-0083-4d25-a70f-31700de4b64e' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ azureUserMapping });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const azureUserMapping: IAzureUserMapping = { id: 456 };
      const user: IUser = { id: 'b54cc3a5-36fb-45ac-a1b0-de6fe00fb6db' };
      azureUserMapping.user = user;

      activatedRoute.data = of({ azureUserMapping });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.azureUserMapping).toEqual(azureUserMapping);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAzureUserMapping>>();
      const azureUserMapping = { id: 123 };
      jest.spyOn(azureUserMappingFormService, 'getAzureUserMapping').mockReturnValue(azureUserMapping);
      jest.spyOn(azureUserMappingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ azureUserMapping });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: azureUserMapping }));
      saveSubject.complete();

      // THEN
      expect(azureUserMappingFormService.getAzureUserMapping).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(azureUserMappingService.update).toHaveBeenCalledWith(expect.objectContaining(azureUserMapping));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAzureUserMapping>>();
      const azureUserMapping = { id: 123 };
      jest.spyOn(azureUserMappingFormService, 'getAzureUserMapping').mockReturnValue({ id: null });
      jest.spyOn(azureUserMappingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ azureUserMapping: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: azureUserMapping }));
      saveSubject.complete();

      // THEN
      expect(azureUserMappingFormService.getAzureUserMapping).toHaveBeenCalled();
      expect(azureUserMappingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAzureUserMapping>>();
      const azureUserMapping = { id: 123 };
      jest.spyOn(azureUserMappingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ azureUserMapping });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(azureUserMappingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
