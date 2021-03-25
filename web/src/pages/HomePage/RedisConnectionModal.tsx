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
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
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
        id: connectionModalType === ModalType.Create ? 'pages.redisConnectionManage.createForm.newRedisConnection' : 'pages.redisConnectionManage.createForm.updateRedisConnection',
        defaultMessage: connectionModalType === ModalType.Create ? '添加Redis连接' : '修改Redis连接',
      })}
      width="600px"
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
          测试连接
          </Button>,
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
              console.log("values222", values)
              form.resetFields();
              if (connectionModalType === ModalType.Create) {
                handleAddRedisConnection(values).then((success) => {
                  console.log("success", success);
                  if (success) {
                    handleConnectionModalVisible(false);
                  }
                });
              } else if (connectionModalType === ModalType.Update) {
                console.log()
                handleUpdateRedisConnection({ id: currentTreeNode?.connectionId, ...values }).then((success) => {
                  console.log("success", success);
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
          name="name"
          label="连接名称"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisConnectionManage.name"
                  defaultMessage="连接名称为必填项"
                />
              ),
            },
          ]}
        >
          <Input placeholder='请输入连接名称'
          // disabled={connectionModalType === ModalType.Update}
          />
        </Form.Item >
        <Form.Item
          name="host"
          label="连接地址"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisConnectionManage.host"
                  defaultMessage="连接地址为必填项"
                />
              ),
            },
          ]}
        >
          <Input placeholder='请输入连接地址' />
        </Form.Item>
        <Form.Item
          name="port"
          label="连接端口"
          initialValue={6379}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisConnectionManage.port"
                  defaultMessage="连接端口为必填项"
                />
              ),
            },
          ]}
        >
          <InputNumber placeholder='请输入连接端口' style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="password"
          label="连接密码"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisConnectionManage.password"
                  defaultMessage="连接密码为必填项"
                />
              ),
            },
          ]}
        >
          <Input placeholder='请输入连接密码' />
        </Form.Item>

        <Form.Item
          name="username"
          label="连接用户名"
        >
          <Input placeholder='请输入连接用户名（选填）' />
        </Form.Item>

        <Form.Item
          name="connectionType"
          label="连接类型"
          initialValue={1}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.redisConnectionManage.connectionType"
                  defaultMessage="连接类型为必填项"
                />
              ),
            },
          ]}
        >
          <Radio.Group>
            <Radio value={1}>单机</Radio>
            <Radio value={2}>集群</Radio>
          </Radio.Group>
        </Form.Item>


      </Form>
    </Modal>
  );
};

export default RedisConnectionModal;
