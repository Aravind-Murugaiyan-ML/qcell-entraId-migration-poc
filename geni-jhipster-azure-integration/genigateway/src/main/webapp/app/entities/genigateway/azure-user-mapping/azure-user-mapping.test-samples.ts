import dayjs from 'dayjs/esm';

import { IAzureUserMapping, NewAzureUserMapping } from './azure-user-mapping.model';

export const sampleWithRequiredData: IAzureUserMapping = {
  id: 23007,
  azureObjectId: 'so psst yippee',
  azureUpn: 'offering duh',
};

export const sampleWithPartialData: IAzureUserMapping = {
  id: 5614,
  azureObjectId: 'ew but',
  azureUpn: 'evangelise anxiously',
  displayName: 'rainstorm',
  jobTitle: 'Forward Integration Associate',
  updatedAt: dayjs('2025-07-19T21:42'),
};

export const sampleWithFullData: IAzureUserMapping = {
  id: 25791,
  azureObjectId: 'for',
  azureUpn: 'valiantly like frigid',
  displayName: 'trudge upon reproachfully',
  email: 'Caterina28@yahoo.com',
  department: 'lest amongst phooey',
  jobTitle: 'Regional Optimization Administrator',
  isActive: true,
  lastLogin: dayjs('2025-07-19T22:17'),
  loginCount: 4168,
  createdAt: dayjs('2025-07-19T17:59'),
  updatedAt: dayjs('2025-07-20T06:31'),
};

export const sampleWithNewData: NewAzureUserMapping = {
  azureObjectId: 'hmph',
  azureUpn: 'inasmuch punish psst',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
