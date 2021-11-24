import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import pages from './en-US/pages';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',

  'button.common.cancel': 'Cancel',
  'button.common.confirm': 'Confirm',
  'button.common.refresh': 'Refresh',
  'button.common.reset': 'Reset',
  'button.common.new': 'New',
  'button.common.save': 'Save',
  'button.common.edit': 'Edit',
  'button.common.delete': 'Delete',

  'list.column.id': 'ID',
  'list.column.key': 'Key',
  'list.column.value': 'Value',
  'list.column.field': 'Field',
  'list.column.score': 'Score',
  'list.column.operation': 'Operation',

  'button.redis.connection.new': 'New Redis Connection',
  'modal.redis.connection.new.title': 'New Redis Connection',
  'modal.redis.connection.edit.title': 'Edit Redis Connection',
  'modal.redis.connection.name': 'Connection Name',
  'modal.redis.connection.host': 'Connection Host',
  'modal.redis.connection.port': 'Connection Port',
  'modal.redis.connection.password': 'Connection Password',
  'modal.redis.connection.username': 'Connection Username',
  'modal.redis.connection.type': 'Connection Type',

  'modal.redis.connection.name.required': 'Please Input Connection Name',
  'modal.redis.connection.host.required': 'Please Input Connection Host',
  'modal.redis.connection.port.required': 'Please Input Connection Port',
  'modal.redis.connection.password.required': 'Please Input Connection Password (Not Required)',
  'modal.redis.connection.username.required': 'Please Input Connection Username (Not Required)',
  'modal.redis.connection.type.required': 'Please Choose Connection Type ',

  'modal.redis.connection.type.value.single': 'Single',
  'modal.redis.connection.type.value.cluster': 'Cluster',

  'modal.redis.connection.button.testConnection': 'Connection Test',
  'modal.redis.connection.button.cancel': 'Cancel',
  'modal.redis.connection.button.confirm': 'Confirm',

  "button.redis.connection.refresh": "Refresh",
  "modal.redis.connection.refresh.confirm.title": "Confirm Refresh",
  "modal.redis.connection.refresh.confirm.content": "This operation will close all connections, whether to continue?",

  "button.redis.connection.edit": "Edit",
  "modal.redis.connection.edit.confirm.title": "Confirm Edit",
  "modal.redis.connection.edit.confirm.content": "This operation will close all connections, whether to continue?",

  "button.redis.connection.delete": "Delete",
  "modal.redis.connection.delete.confirm.title": "Confirm Delete",
  "modal.redis.connection.delete.confirm.content": "This operation is unrecoverable, whether to continue?",

  'message.redis.connection.queryRedisConnectionFailed.content': 'Query redis connection failed!',
  'message.redis.connection.operationFailed.content': 'Operation failed!',
  'message.redis.connection.testing.content': 'Testing...',
  'message.redis.connection.connectSucceed.content': 'Connect succeed!',
  'message.redis.connection.connectFailed.content': 'Connect failed, please retry later! Reason for failure:',
  'message.redis.connection.submitting.content': 'Submitting...',
  'message.redis.connection.chooseKey.content': 'Please choose a KEY first!',
  'message.redis.connection.addedSucceed.content': 'Add succeed!',
  'message.redis.connection.addedFailed': 'Add failed, please retry later! Reason for failure:',
  'message.redis.connection.deleteSucceed.content': 'Delete succeed!',
  'message.redis.connection.deleteFailed.content': 'Delete failed, please retry later! Reason for failure:',
  'message.redis.connection.editSucceed.content': 'Edit succeed!',
  'message.redis.connection.editFailed.content': 'Edit failed, please retry later! Reason for failure:',
  'message.redis.connection.renameSucceed.content': 'Rename succeed!',
  'message.redis.connection.renameFailed.content': 'Rename failed, please retry later! Reason for failure:',
  'message.redis.connection.setTtlSucceed.content': 'Set TTL succeed!',
  'message.redis.connection.setTtlFailed.content': 'Set TTL failed, please retry later! Reason for failure:',
  'message.redis.connection.queryDatabaseFailed.content': 'Query Database failed, please retry later! Reason for failure:',
  'message.redis.connection.saving.content': 'Saving...',
  'message.redis.connection.saveSucceed.content': 'Save succeed!',
  'message.redis.connection.saveFailed.content': 'Save failed, please retry later! Reason for failure:',
  'message.redis.connection.querykeyFailed.content': 'Query key failed, please retry later! Reason for failure:',
  'message.redis.data.allDataLoaded.content': 'All data has been loaded!',
  'message.redis.connection.queryAttributesFailed.content': 'Query attributes failed, please retry later! Reason for failure:',

  'modal.redis.key.string.value.required': 'Please Input Value',

  'button.redis.key.new': "New Redis Key",
  'modal.redis.key.new.key': 'Key',
  'modal.redis.key.new.type': 'Type',
  'modal.redis.key.new.value': 'Value',
  'modal.redis.key.new.zset.score': 'Score',
  'modal.redis.key.new.hash.field': 'Field',

  'modal.redis.key.new.key.required': 'Please Input Key',
  'modal.redis.key.new.type.required': 'Please Select Type',
  'modal.redis.key.new.value.required': 'Please Input Value',
  'modal.redis.key.new.zset.score.required': 'Please Input Score',
  'modal.redis.key.new.hash.field.required': 'Please Input Field',

  'button.redis.key.rename': "Rename",
  'modal.redis.key.rename.title': 'Rename Key',
  'modal.redis.key.rename.newKey': 'New Key',
  'modal.redis.key.rename.newKey.required': 'Please Input New Key',

  'button.redis.key.delete': "Delete",
  'modal.redis.key.delete.confirm.title': 'Delete Confirm',

  'button.redis.key.ttl': "Set TTL",
  'modal.redis.key.ttl.title': 'Set TTL',
  'modal.redis.key.ttl.ttl': 'TTL',
  'modal.redis.key.ttl.ttl.required': 'Please Input TTL',

  'modal.redis.list.addRow.title': 'Add Row',
  'modal.redis.list.editRow.title': 'Edit Row',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
