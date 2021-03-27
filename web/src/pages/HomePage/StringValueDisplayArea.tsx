import React, { useEffect } from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import {
  EditOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  RedoOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { queryRedisValue } from './service'

const { TextArea, Search } = Input;
const { confirm } = Modal;

export enum ModalType { Create, Update };

export type StringValueDisplayAreaProps = {
  currentTreeNode;
};

const StringValueDisplayArea: React.FC<StringValueDisplayAreaProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const {
    currentTreeNode
  } = props;


  useEffect(() => {
    if (currentTreeNode) {
      getStringKeyValue().then((value) => {
        form.setFieldsValue({ stringRedisValue: value })
      });
    }
  });

  const getStringKeyValue = async () => {
    const { connectionId, databaseId, redisKey } = currentTreeNode
    try {
      return await queryRedisValue({ connectionId, databaseId, key: redisKey, type: 'string' }).then((response) => {
        if (response && response.success) {
          console.log(response.result)
          return response.result.value;
        }
        throw new Error(response.message);
      })
    } catch (error) {
      message.error('查询Key值失败');
    }
  }

  return (
    <div style={{ height: '100%', textAlign: 'right' }}>
      <Form
        form={form}
        style={{ height: '100%' }}
        name="stringRedisValueForm"
      >
        <Form.Item
          label='Value'
          name="stringRedisValue"
          noStyle
          rules={[{ required: true, message: '请输入键值！' }]}
        >
          <TextArea style={{ height: '100%', fontSize: '16px' }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default StringValueDisplayArea;
