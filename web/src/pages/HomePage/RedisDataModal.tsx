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

export type RedisDataModalProps = {
  form;
  currentTreeNode;
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
    currentTreeNode,
    handleAddRedisData,
    handleDataModalVisible,
    refreshCurrentDatabaseKeys,
    dataModalVisible
  } = props;

  /** 所有Redis连接数据*/
  const [type, setType] = useState('');

  const onTypeChange = (type) => {
    console.log(type)
    setType(type)
  }

  const createParamByType = (values) => {
    console.log(currentTreeNode)
    const { connectionId, databaseId } = currentTreeNode;
    const data = { ...values, connectionId, databaseId }
    if (values.type === 'list' || values.type === 'zset') {
      data.value = [values.value]
    }
    return data;
  }

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
          handleDataModalVisible(false);
        }}>
          取消
          </Button>,
        <Button key="submit" type="primary" onClick={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleAddRedisData(createParamByType(values)).then((success) => {
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
            onChange={onTypeChange}
          >
          </Select>
        </Form.Item>
        {type === 'zset' ?
          (<Form.Item
            name="score"
            label="分值"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisDataManage.score"
                    defaultMessage="分值为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入分值' />
          </Form.Item>) : null}
        {type === 'hash' ?
          (<Form.Item
            name="hashKey"
            label="Hash Key"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisDataManage.hashKey"
                    defaultMessage="Hash Key为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入Hash Key' />
          </Form.Item>) : null}
        <Form.Item
          name="value"
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
