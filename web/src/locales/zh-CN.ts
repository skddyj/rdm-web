import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pages from './zh-CN/pages';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',

  'button.common.cancel': '取消',
  'button.common.confirm': '确认',
  'button.common.refresh': '刷新',
  'button.common.reset': '重置',
  'button.common.new': '新增',
  'button.common.save': '保存',
  'button.common.edit': '编辑',
  'button.common.delete': '删除',

  'list.column.id': 'ID',
  'list.column.key': 'Key',
  'list.column.value': 'Value',
  'list.column.field': 'Field',
  'list.column.score': 'Score',
  'list.column.operation': '操作',

  'button.redis.connection.new': '添加Redis连接',
  'modal.redis.connection.new.title': '添加Redis连接',
  'modal.redis.connection.edit.title': '修改Redis连接',
  'modal.redis.connection.name': '连接名称',
  'modal.redis.connection.host': '连接地址',
  'modal.redis.connection.port': '连接端口',
  'modal.redis.connection.password': '连接密码',
  'modal.redis.connection.username': '连接用户名',
  'modal.redis.connection.type': '连接类型',

  'modal.redis.connection.name.required': '请输入连接名称',
  'modal.redis.connection.host.required': '请输入连接地址',
  'modal.redis.connection.port.required': '请输入连接端口',
  'modal.redis.connection.password.required': '请输入连接密码 (选填)',
  'modal.redis.connection.username.required': '请输入连接用户名 (选填)',
  'modal.redis.connection.type.required': '请选择连接类型',

  'modal.redis.connection.type.value.single': '单机',
  'modal.redis.connection.type.value.cluster': '集群',

  'modal.redis.connection.button.testConnection': '测试连接',
  'modal.redis.connection.button.cancel': '取消',
  'modal.redis.connection.button.confirm': '确定',

  "button.redis.connection.refresh": "刷新",
  "modal.redis.connection.refresh.confirm.title": "刷新确认",
  "modal.redis.connection.refresh.confirm.content": "该操作会关闭所有连接, 是否继续?",

  "button.redis.connection.edit": "编辑",
  "modal.redis.connection.edit.confirm.title": "编辑确认",
  "modal.redis.connection.edit.confirm.content": "该操作会关闭所有连接, 是否继续?",

  "button.redis.connection.delete": "删除",
  "modal.redis.connection.delete.confirm.title": "删除确认",
  "modal.redis.connection.delete.confirm.content": "此操作不可恢复, 是否继续?",

  'message.redis.connection.queryRedisConnectionFailed.content': '查询Redis连接失败!',
  'message.redis.connection.operationFailed.content': '操作失败!',
  'message.redis.connection.testing.content': '正在测试...',
  'message.redis.connection.connectSucceed.content': '连接成功!',
  'message.redis.connection.connectFailed.content': '连接失败, 请稍后重试! 失败原因:',
  'message.redis.connection.submitting.content': '正在提交...',
  'message.redis.connection.chooseKey.content': '请先选择一个Key!',
  'message.redis.connection.addedSucceed.content': '添加成功!',
  'message.redis.connection.addedFailed': '添加失败, 请稍后重试! 失败原因:',
  'message.redis.connection.deleteSucceed.content': '删除成功!',
  'message.redis.connection.deleteFailed.content': '删除失败, 请稍后重试! 失败原因:',
  'message.redis.connection.editSucceed.content': '编辑成功!',
  'message.redis.connection.editFailed.content': '编辑失败, 请稍后重试! 失败原因:',
  'message.redis.connection.renameSucceed.content': '重命名成功!',
  'message.redis.connection.renameFailed.content': '重命名失败, 请稍后重试! 失败原因:',
  'message.redis.connection.setTtlSucceed.content': '设置TTL成功!',
  'message.redis.connection.setTtlFailed.content': '设置TTL失败, 请稍后重试! 失败原因:',
  'message.redis.connection.queryDatabaseFailed.content': '查询数据库失败, 请稍后重试! 失败原因:',
  'message.redis.connection.saving.content': '正在保存...',
  'message.redis.connection.saveSucceed.content': '保存成功!',
  'message.redis.connection.saveFailed.content': '保存失败, 请稍后重试! 失败原因:',
  'message.redis.connection.querykeyFailed.content': '查询Key失败, 请稍后重试! 失败原因:',
  'message.redis.data.allDataLoaded.content': '数据已全部加载完毕!',
  'message.redis.connection.queryAttributesFailed.content': '查询属性失败, 请稍后重试! 失败原因:',

  'modal.redis.key.string.value.required': '请输入值',

  'button.redis.key.new': "新建Redis Key",
  'modal.redis.key.new.key': 'Key',
  'modal.redis.key.new.type': '类型',
  'modal.redis.key.new.value': 'Value',
  'modal.redis.key.new.zset.score': '分数',
  'modal.redis.key.new.hash.field': 'Field',

  'modal.redis.key.new.key.required': '请输入Key',
  'modal.redis.key.new.type.required': '请选择类型',
  'modal.redis.key.new.value.required': '请输入Value',
  'modal.redis.key.new.zset.score.required': '请输入分数',
  'modal.redis.key.new.hash.field.required': '请输入Field',

  'button.redis.key.rename': "重命名",
  'modal.redis.key.rename.title': '重命名Key',
  'modal.redis.key.rename.newKey': 'New Key',
  'modal.redis.key.rename.newKey.required': '请输入New Key',

  'button.redis.key.ttl': "设置TTL",
  'modal.redis.key.ttl.title': '设置TTL',
  'modal.redis.key.ttl.ttl': 'TTL',
  'modal.redis.key.ttl.ttl.required': '请输入TTL',

  'modal.redis.list.addRow.title': '添加行',
  'modal.redis.list.editRow.title': '编辑行',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
