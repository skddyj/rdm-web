import React from 'react';
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

export type RedisDataModalProps = {
  form;
  handleAddRedisConnection;
  handleUpdateRedisConnection;
  handleTestRedisConnection;
  handleConnectionModalVisible;
  refreshConnection;
  connectionModalType;
  connectionModalVisible;
};

const RedisDataModal: React.FC<RedisDataModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    handleAddRedisConnection,
    handleUpdateRedisConnection,
    handleTestRedisConnection,
    handleConnectionModalVisible,
    refreshConnection,
    connectionModalType,
    connectionModalVisible
  } = props;

  return (
    <Modal
      title={formatMessage({
        id: connectionModalType === ModalType.Create ? 'pages.redisConnectionManage.newRedisKey' : 'pages.redisConnectionManage.updateRedisKey',
        defaultMessage: connectionModalType === ModalType.Create ? '添加Redis Key' : '修改Redis Key',
      })}
      width="600px"
      destroyOnClose
      visible={connectionModalVisible}
      footer={[
        <Button key="back" onClick={() => {
          form.resetFields();
          handleConnectionModalVisible(false);
        }}>
          取消
          </Button>,
        <Button key="submit" type="primary" onClick={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              if (connectionModalType === ModalType.Create) {
                handleAdd(values).then((success) => {
                  console.log("success", success);
                  if (success) {
                    refreshConnection();
                    handleConnectionModalVisible(false);
                  }
                });
              } else if (connectionModalType === ModalType.Update) {
                handleUpdate({ id: currentRow?.id, ...values }).then((success) => {
                  console.log("success", success);
                  if (success) {
                    refreshConnection();
                    handleConnectionModalVisible(false);
                  }
                });
              }
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}>
          确定
          </Button>,
      ]}
      onCancel={() => {
        form.resetFields();
        handleConnectionModalVisible(false);
      }}
    >
      <Form
        {...layout}
        layout="horizontal"
        form={form}
        name="form_in_modal"
      >
        <Form.Item
          name="key"
          label="Key"
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
          <Input placeholder='请输入Key'
          // disabled={connectionModalType === ModalType.Update}
          />
        </Form.Item >
        <Form.Item
          name="type"
          label="类型"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisDataManage.type"
                  defaultMessage="类型为必填项"
                />
              ),
            },
          ]}
        >
          <Select
            placeholder="请选择类型"
            allowClear
          >
            <Option value="string">String</Option>
            <Option value="list">List</Option>
            <Option value="set">Set</Option>
            <Option value="zset">ZSet</Option>
            <Option value="hash">Hash</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="port"
          label="Value"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisDataManage.value"
                  defaultMessage="Value为必填项"
                />
              ),
            },
          ]}
        >
          <TextArea placeholder='请输入Value' style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RedisDataModal;
