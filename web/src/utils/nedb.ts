const path = require('path')
const Datastore = require('nedb');


// 示例 1: 内存数据库(没有必要调用loadDatabase方法)
//const nedb = new Datastore();

const nedb = {
  t_redis_connection: new Datastore({ filename: path.join(__dirname, '/t_redis_connection.db'), autoload: true }),
  redis_connection: new Datastore({ filename: path.join(__dirname, '/nedb.db'), autoload: true })
};

export default nedb;