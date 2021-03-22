import request from '@/utils/request';
import { validRequest } from '@/utils/utils'
import type { TableListParams, TableListItem, RedisConnectionParams } from './data.d';

/***********************Redis连接****************************/

/**
 * 查询Redis连接
 */
export async function queryAllRedisConnection() {
  return request('/api/redisConnection/listAll')
}

/**
 * 添加Redis连接
 */
export async function addRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
/**
 * 修改Redis连接
 */
export async function updateRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection', {
    method: 'PUT',
    data: {
      ...params,
      method: 'PUT',
    },
  });
}
/**
 * 删除Redis连接
 */
export async function removeRedisConnection(params: { key: number[] }) {
  return request('/api/redisConnection', {
    method: 'DELETE',
    data: {
      ids: params,
      method: 'delete',
    },
  });
}
/**
 * 测试Redis连接
 */
export async function testRedisConnection(params: RedisConnectionParams) {
  return request('/api/redisConnection/test', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
/***********************Redis数据库****************************/
export async function queryDatabaseCount(id) {
  return request(`/api/redisData/databaseCount/${id}`);
}

export async function queryDatabaseKeys(params) {
  return request('/api/redisData/keys', {
    params,
  })
}

/***********************Redis数据****************************/
export async function queryKeyValue(params) {
  return request('/api/redisData/get', {
    params,
  })
}

export async function setKeyValue(params) {
  console.log('params', params)
  return request('/api/redisData/set', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 添加Redis 键值
 */
export async function addRedisKeyValue(params: RedisConnectionParams) {
  return request('/api/redisData/', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}


