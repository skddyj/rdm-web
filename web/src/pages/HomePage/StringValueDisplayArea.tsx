import React from 'react';
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

const { TextArea, Search } = Input;
const { confirm } = Modal;

export enum ModalType { Create, Update };

export type ValueDisplayAreaProps = {
  textAreaForm;
  currentRedisKey;
  currentTreeNode;
  onRedisValueUpdate;
};

const ValueDisplayArea: React.FC<ValueDisplayAreaProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    textAreaForm,
    currentRedisKey,
    currentTreeNode,
    onRedisValueUpdate
  } = props;

  return (
    <div style={{ height: '80%', textAlign: 'right' }}>
      <Form
        form={textAreaForm}
        style={{ height: '80%' }}
        name="redisValueForm"
      >
        <Form.Item
          label='Value'
          name="redisValue"
          noStyle
          rules={[{ required: true, message: '请输入键值！' }]}
        >
          <TextArea style={{ height: '100%', fontSize: '16px' }} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ValueDisplayArea;
