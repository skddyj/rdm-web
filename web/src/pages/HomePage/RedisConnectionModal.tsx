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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export enum ModalType { Create, Update };

export type RedisConnectionModalProps = {
  form;
  currentTreeNode;
  handleAddRedisConnection;
  handleUpdateRedisConnection;
  handleTestRedisConnection;
  handleConnectionModalVisible;
  loadAllRedisConnection;
  connectionModalType;
  connectionModalVisible;
  clearSelected;
};

const RedisConnectionModal: React.FC<RedisConnectionModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentTreeNode,
    handleAddRedisConnection,
    handleUpdateRedisConnection,
    handleTestRedisConnection,
    handleConnectionModalVisible,
    loadAllRedisConnection,
    connectionModalType,
    connectionModalVisible,
    clearSelected
  } = props;

  return (
    <Modal
      title={formatMessage({
        id: connectionModalType === ModalType.Create ? 'modal.redis.connection.new.title' : 'modal.redis.connection.edit.title',
      })}
      width="750px"
      destroyOnClose
      visible={connectionModalVisible}
      footer={[
        <Button key="testConnection" onClick={() => {
          form
            .validateFields()
            .then(values => {
              handleTestRedisConnection(values);
            })
            .catch(err => {
              console.log('Validate Failed:', err);
            });
        }}>
          {formatMessage({ "id": "modal.redis.connection.button.testConnection" })}
        </Button>,
        <Button key="back" onClick={() => {
          form.resetFields();
          handleConnectionModalVisible(false);
        }}>
          {formatMessage({ "id": "modal.redis.connection.button.cancel" })}
        </Button>,
        <Button key="submit" type="primary" onClick={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              if (connectionModalType === ModalType.Create) {
                handleAddRedisConnection(values).then((success) => {
                  if (success) {
                    handleConnectionModalVisible(false);
                  }
                });
              } else if (connectionModalType === ModalType.Update) {
                handleUpdateRedisConnection({ id: currentTreeNode?.connectionId, ...values }).then((success) => {
                  if (success) {
                    clearSelected();
                    loadAllRedisConnection();
                    handleConnectionModalVisible(false);
                  }
                });
              }
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}>
          {formatMessage({ "id": "modal.redis.connection.button.confirm" })}
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
          name="name"
          label={formatMessage({ "id": "modal.redis.connection.name" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.connection.name.required"
                />
              )
            }
          ]}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.connection.name.required" })} />
        </Form.Item >
        <Form.Item
          name="host"
          label={formatMessage({ "id": "modal.redis.connection.host" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.connection.host.required"
                />
              ),
            },
          ]}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.connection.host.required" })} />
        </Form.Item>
        <Form.Item
          name="port"
          label={formatMessage({ "id": "modal.redis.connection.port" })}
          initialValue={6379}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.connection.port.required"
                />
              ),
            },
          ]}
        >
          <InputNumber placeholder={formatMessage({ "id": "modal.redis.connection.port.required" })} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="password"
          label={formatMessage({ "id": "modal.redis.connection.password" })}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.connection.password.required" })} />
        </Form.Item>

        <Form.Item
          name="username"
          label={formatMessage({ "id": "modal.redis.connection.username" })}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.connection.username.required" })} />
        </Form.Item>

        <Form.Item
          name="connectionType"
          label={formatMessage({ "id": "modal.redis.connection.type" })}
          initialValue={0}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.connection.connectionType.required"
                />
              ),
            },
          ]}
        >
          <Radio.Group>
            <Radio value={0}>{formatMessage({ "id": "modal.redis.connection.type.value.single" })}</Radio>
            <Radio value={1}>{formatMessage({ "id": "modal.redis.connection.type.value.cluster" })}</Radio>
            {/* <Radio value={2}>哨兵</Radio> */}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default RedisConnectionModal;
