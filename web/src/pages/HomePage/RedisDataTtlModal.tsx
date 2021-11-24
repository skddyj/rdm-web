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
import { format } from 'prettier';

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
  handleExpireRedisKey;
  handleDataTtlModalVisible;
  dataTtlModalVisible;
  handleRefreshRedisValue;
};

const RedisDataTtlModal: React.FC<RedisDataRenameModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    currentTreeNode,
    currentRedisKey,
    handleExpireRedisKey,
    handleDataTtlModalVisible,
    dataTtlModalVisible,
    handleRefreshRedisValue
  } = props;

  const [redisKeyTtlForm] = Form.useForm();

  return (
    <Modal
      title={formatMessage({
        id: 'modal.redis.key.ttl.title',
      })}
      width="600px"
      destroyOnClose
      visible={dataTtlModalVisible}
      footer={[
        <Button key="cancel" onClick={() => {
          redisKeyTtlForm.resetFields();
          handleDataTtlModalVisible(false);
        }}>
          {formatMessage({ "id": "button.common.cancel" })}
        </Button>,
        <Button key="submit" type="primary" onClick={() => {
          redisKeyTtlForm
            .validateFields()
            .then((values) => {
              const { ttl } = values;
              const { connectionId, databaseId } = currentTreeNode;
              redisKeyTtlForm.resetFields();
              handleExpireRedisKey({ connectionId, databaseId, key: currentRedisKey, ttl }).then((success) => {
                if (success) {
                  handleRefreshRedisValue()
                }
              });
              handleDataTtlModalVisible(false)
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}>
          {formatMessage({ "id": "button.common.confirm" })}
        </Button>,
      ]}
      onCancel={() => {
        redisKeyTtlForm.resetFields();
        handleDataTtlModalVisible(false);
      }}
    >
      <Form
        {...layout}
        layout="horizontal"
        form={redisKeyTtlForm}
        name="redisKeyTTLForm"
      >
        <Form.Item

          name="ttl"
          label={formatMessage({ "id": "modal.redis.key.ttl.ttl" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.key.ttl.ttl.required"
                />
              ),
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder={formatMessage({ "id": "modal.redis.key.ttl.ttl.required" })} step={10} />
        </Form.Item >
      </Form>
    </Modal>
  );
};

export default RedisDataTtlModal;
