import dayjs from 'dayjs/esm';

import { ISecurityAuditLog, NewSecurityAuditLog } from './security-audit-log.model';

export const sampleWithRequiredData: ISecurityAuditLog = {
  id: 2211,
};

export const sampleWithPartialData: ISecurityAuditLog = {
  id: 13848,
  eventType: 'DATA_ACCESS',
  result: 'DENIED',
};

export const sampleWithFullData: ISecurityAuditLog = {
  id: 32661,
  userId: 'headline mmm',
  eventType: 'DATA_ACCESS',
  resourceType: 'bone',
  resourceId: 'at ouch anti',
  action: 'actually spirited',
  result: 'SUCCESS',
  timestamp: dayjs('2025-07-20T02:44'),
};

export const sampleWithNewData: NewSecurityAuditLog = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
