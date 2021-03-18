import request from '@/utils/request';
import { validRequest } from '@/utils/utils'
import type { TableListParams, TableListItem, RedisConnectionParams } from './data.d';

export async function queryAllRedisConnection() {
  return request('/api/redisConnection/listAll')
}

export async function queryDatabaseCount(id) {
  return request(`/api/redisData/databaseCount/${id}`);
}

export async function queryDatabaseKeys(params) {
  return request('/api/redisData/keys', {
    params,
  })
}

export async function addRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection', {
    method: 'PUT',
    data: {
      ...params,
      method: 'PUT',
    },
  });
}

export async function removeRedisConnection(params: { key: number[] }) {
  return request('/api/redisConnection', {
    method: 'DELETE',
    data: {
      ids: params,
      method: 'delete',
    },
  });
}

export async function testRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection/test', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
