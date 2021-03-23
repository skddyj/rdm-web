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

const typeOptions = [
  { label: 'String', value: 'string' },
  { label: 'List', value: 'list' },
  { label: 'Set', value: 'set' },
  { label: 'ZSet', value: 'zset' },
  { label: 'Hash', value: 'hash' }
]

export type RedisDataModalProps = {
  form;
  handleAddRedisData;
  handleDataModalVisible;
  refreshCurrentDatabaseKeys;
  dataModalVisible;
};

const RedisDataModal: React.FC<RedisDataModalProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    handleAddRedisData,
    handleDataModalVisible,
    refreshCurrentDatabaseKeys,
    dataModalVisible
  } = props;

  return (
    <Modal
      title={formatMessage({
        id: 'pages.redisDataManage.createForm.newRedisData',
        defaultMessage: '新建Key'
      })}
      width="600px"
      destroyOnClose
      visible={dataModalVisible}
      footer={[
        <Button key="back" onClick={() => {
          form.resetFields();
          handleAddRedisData(false);
        }}>
          取消
          </Button>,
        <Button key="submit" type="primary" onClick={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleAddRedisData(values).then((success) => {
                console.log("success", success);
                if (success) {
                  refreshCurrentDatabaseKeys();
                  handleDataModalVisible(false);
                }
              });
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
        handleDataModalVisible(false);
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
            options={typeOptions}
          >
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
