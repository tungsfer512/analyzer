/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import BaseService from '@/services/baseService';
import { ip } from '@/services/ip';
import type { IGroupRecord } from '../../models/groups';
import axios from '@/utils/axios';

class Services extends BaseService<IGroupRecord> {

}

export default new Services({ name: 'groups', url: 'groups', formData: false });
