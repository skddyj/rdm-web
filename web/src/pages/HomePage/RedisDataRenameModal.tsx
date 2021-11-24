import React, { useState } from 'react';
import { Result, Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb, Radio } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import TextArea from 'antd/lib/input/TextArea';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export enum ModalType { Create, Update };

const typeOptions = [
  { label: 'String', value: 'string' },
  { label: 'List', value: 'list' },
  { label: 'Set', value: 'set' },
  { label: 'ZSet', value: 'zset' },
  { label: 'Hash', value: 'hash' }
]

export type RedisDataRenameModalProps = {
  currentTreeNode;
  currentRedisKey;
  handleRenameRedisKey;
  handleDataRenameModalVisible;
  dataRenameModalVisible;
  handleRefreshRedisValue;
};

const RedisDataRenameModal: React.FC<RedisDataRenameModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    currentTreeNode,
    currentRedisKey,
    handleRenameRedisKey,
    handleDataRenameModalVisible,
    dataRenameModalVisible,
    handleRefreshRedisValue
  } = props;

  const [redisKeyRenameForm] = Form.useForm();

  return (
    <Modal
      title={formatMessage({
        id: 'modal.redis.key.rename.title',
      })}
      width="600px"
      destroyOnClose
      visible={dataRenameModalVisible}
      footer={[
        <Button key="cancel" onClick={() => {
          redisKeyRenameForm.resetFields();
          handleDataRenameModalVisible(false);
        }}>
          {formatMessage({ "id": "button.common.cancel" })}
        </Button>,
        <Button key="submit" type="primary" onClick={() => {
          redisKeyRenameForm
            .validateFields()
            .then((values) => {
              const { newKey } = values;
              const { connectionId, databaseId } = currentTreeNode;
              redisKeyRenameForm.resetFields();
              handleRenameRedisKey({ connectionId, databaseId, key: currentRedisKey, newKey });
              handleDataRenameModalVisible(false)
            })
            .catch(info => {
            });
        }}>
          {formatMessage({ "id": "button.common.confirm" })}
        </Button>,
      ]}
      onCancel={() => {
        redisKeyRenameForm.resetFields();
        handleDataRenameModalVisible(false);
      }}
    >
      <Form
        {...layout}
        layout="horizontal"
        form={redisKeyRenameForm}
        name="redisKeyRenameForm"
      >
        <Form.Item
          name="newKey"
          label={formatMessage({ "id": "modal.redis.key.rename.newKey" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.key.rename.newKey.required"
                />
              ),
            },
          ]}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.key.rename.newKey.required" })} />
        </Form.Item >
      </Form>
    </Modal>
  );
};

export default RedisDataRenameModal;
