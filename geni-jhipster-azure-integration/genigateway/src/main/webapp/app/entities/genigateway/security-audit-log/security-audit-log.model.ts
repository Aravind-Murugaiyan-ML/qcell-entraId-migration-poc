import dayjs from 'dayjs/esm';
import { SecurityEventType } from 'app/entities/enumerations/security-event-type.model';
import { SecurityResult } from 'app/entities/enumerations/security-result.model';

export interface ISecurityAuditLog {
  id: number;
  userId?: string | null;
  eventType?: keyof typeof SecurityEventType | null;
  resourceType?: string | null;
  resourceId?: string | null;
  action?: string | null;
  result?: keyof typeof SecurityResult | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewSecurityAuditLog = Omit<ISecurityAuditLog, 'id'> & { id: null };
