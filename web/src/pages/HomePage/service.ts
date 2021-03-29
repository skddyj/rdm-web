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
export async function removeRedisConnection(id) {
  return request(`/api/redisConnection/${id}`, {
    method: 'DELETE'
  });
}

/**
 * 批量删除Redis连接
 */
export async function batchRemoveRedisConnection(params: { key: number[] }) {
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
/**
 * 添加Redis键
 */
 export async function addRedisKey(params) {
  return request('/api/redisData/addKey', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 删除Redis键
 */
 export async function removeRedisKey(params) {
  return request('/api/redisData/removeKey', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 重命名Redis键
 */
 export async function renameRedisKeyValue(params) {
  return request('/api/redisData/renameKey', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 修改Redis键ttl
 */
 export async function expireRedisKeyValue(params) {
  return request('/api/redisData/expire', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 查询Redis键属性
 */
export async function queryKeyAttr(params) {
  return request('/api/redisData/getKeyAttr', {
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
 * 添加Redis值
 */
 export async function addRedisValue(params) {
  return request('/api/redisData/addValue', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 查询redis值
 */
export async function queryRedisValue(params) {
  return request('/api/redisData/getValue', {
    params,
  })
}

/**
 * 修改Redis值
 */
 export async function updateRedisValue(params) {
  return request('/api/redisData/updateValue', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 删除Redis值
 */
 export async function removeRedisValue(params) {
  return request('/api/redisData/removeValue', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}