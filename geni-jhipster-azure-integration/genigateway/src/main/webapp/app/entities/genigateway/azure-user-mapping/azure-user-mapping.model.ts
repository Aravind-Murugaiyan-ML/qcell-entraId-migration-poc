import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IAzureUserMapping {
  id: number;
  azureObjectId?: string | null;
  azureUpn?: string | null;
  displayName?: string | null;
  email?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  isActive?: boolean | null;
  lastLogin?: dayjs.Dayjs | null;
  loginCount?: number | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewAzureUserMapping = Omit<IAzureUserMapping, 'id'> & { id: null };
