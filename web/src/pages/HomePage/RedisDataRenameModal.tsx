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
  handleRenameRedisKey;
  handleDataRenameModalVisible;
  dataRenameModalVisible;
};

const RedisDataRenameModal: React.FC<RedisDataRenameModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    currentTreeNode,
    handleRenameRedisKey,
    handleDataRenameModalVisible,
    dataRenameModalVisible
  } = props;

  const [redisKeyRenameForm] = Form.useForm();

  return (
    <Modal
      title={formatMessage({
        id: 'pages.redisDataManage.createForm.renameRedisKey',
        defaultMessage: '重命名Key'
      })}
      width="600px"
      destroyOnClose
      visible={dataRenameModalVisible}
      footer={[
        <Button key="cancel" onClick={() => {
          redisKeyRenameForm.resetFields();
          handleDataRenameModalVisible(false);
        }}>
          取消
          </Button>,
        <Button key="submit" type="primary" onClick={() => {
          redisKeyRenameForm
            .validateFields()
            .then((values) => {
              console.log(values)
              const { newKey } = values;
              const { connectionId, databaseId, redisKey } = currentTreeNode;
              redisKeyRenameForm.resetFields();
              handleRenameRedisKey({ connectionId, databaseId, key: redisKey, newKey });
              handleDataRenameModalVisible(false)
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}>
          确定
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
          label="New Key"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisDataManage.key"
                  defaultMessage="Key为必填项"
                />
              ),
            },
          ]}
        >
          <Input placeholder='请输入New Key' />
        </Form.Item >
      </Form>
    </Modal>
  );
};

export default RedisDataRenameModal;
