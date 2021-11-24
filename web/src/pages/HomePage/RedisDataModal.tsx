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
  refreshCurrentDatabase;
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
    refreshCurrentDatabase,
    dataModalVisible
  } = props;

  /** 所有Redis连接数据*/
  const [type, setType] = useState('');

  const onTypeChange = (type) => {
    setType(type)
  }

  const createParamByType = (fields) => {
    const { key, type } = fields;
    const { connectionId, databaseId } = currentTreeNode;
    const data = { connectionId, databaseId, key, type }
    if (type === 'string' || type === 'list' || type === 'set') {
      data.rowValue = fields.value
    } else if (type === 'zset') {
      data.rowValue = { score: fields.score, value: fields.value }
    } else if (type === 'hash') {
      data.rowValue = { field: fields.field, value: fields.value }
    }
    return data;
  }

  return (
    <Modal
      title={formatMessage({
        id: 'button.redis.key.new',
      })}
      width="750px"
      destroyOnClose
      visible={dataModalVisible}
      footer={[
        <Button key="back" onClick={() => {
          form.resetFields();
          handleDataModalVisible(false);
        }}>
          {formatMessage({ "id": "button.common.cancel" })}
        </Button>,
        <Button key="submit" type="primary" onClick={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleAddRedisData(createParamByType(values)).then((success) => {
                if (success) {
                  refreshCurrentDatabase();
                  handleDataModalVisible(false);
                }
              });
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}>
          {formatMessage({ "id": "button.common.confirm" })}
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
          label={formatMessage({ "id": "modal.redis.key.new.key" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.key.new.key.required"
                />
              ),
            },
          ]}
        >
          <Input placeholder={formatMessage({ "id": "modal.redis.key.new.key.required" })} />
        </Form.Item >
        <Form.Item
          name="type"
          label={formatMessage({ "id": "modal.redis.key.new.type" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.key.new.type.required"
                />
              ),
            },
          ]}
        >
          <Select
            placeholder={formatMessage({ "id": "modal.redis.key.new.type.required" })}
            allowClear
            options={typeOptions}
            onChange={onTypeChange}
          >
          </Select>
        </Form.Item>
        {type === 'zset' ?
          (<Form.Item
            name="score"
            label={formatMessage({ "id": "modal.redis.key.new.zset.score" })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="modal.redis.key.new.zset.score.required"
                  />
                ),
              },
            ]}
          >
            <Input placeholder={formatMessage({ "id": "modal.redis.key.new.zset.score.required" })} />
          </Form.Item>) : null}
        {type === 'hash' ?
          (<Form.Item
            name="field"
            label={formatMessage({ "id": "modal.redis.key.new.hash.field" })}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="modal.redis.key.new.hash.field.required"
                  />
                ),
              },
            ]}
          >
            <Input placeholder={formatMessage({ "id": "modal.redis.key.new.hash.field.required" })} />
          </Form.Item>) : null}
        <Form.Item
          name="value"
          label={formatMessage({ "id": "modal.redis.key.new.value" })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="modal.redis.key.new.value.required"
                />
              ),
            },
          ]}
        >
          <TextArea placeholder={formatMessage({ "id": "modal.redis.key.new.value.required" })} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RedisDataModal;
