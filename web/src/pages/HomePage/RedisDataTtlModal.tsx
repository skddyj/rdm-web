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
        id: 'pages.redisDataManage.createForm.setTTL',
        defaultMessage: '设置TTL'
      })}
      width="600px"
      destroyOnClose
      visible={dataTtlModalVisible}
      footer={[
        <Button key="cancel" onClick={() => {
          redisKeyTtlForm.resetFields();
          handleDataTtlModalVisible(false);
        }}>
          取消
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
          确定
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
          label="TTL"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisDataManage.ttl"
                  defaultMessage="TTL为必填项"
                />
              ),
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder='请输入TTL' step={10} />
        </Form.Item >
      </Form>
    </Modal>
  );
};

export default RedisDataTtlModal;
