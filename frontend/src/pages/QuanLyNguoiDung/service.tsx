/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BaseService from '@/services/baseService';
import type { IUserRecord } from '../../models/users';

class Services extends BaseService<IUserRecord> {
}

export default new Services({ name: 'users', url: 'users', formData: false });
