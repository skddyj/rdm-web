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

export type ValueDisplayCardProps = {
  textAreaForm;
  currentRedisKey;
  currentTreeNode;
  onRedisValueUpdate;
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    textAreaForm,
    currentRedisKey,
    currentTreeNode,
    onRedisValueUpdate
  } = props;

  return (
    <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }} bordered={false}>
      <div style={{ height: '20%' }}>
        <div style={{ float: 'left', width: '50%' }}>
          <Form
            form={textAreaForm}
            style={{ height: '80%' }}
            name="redisKeyForm"
          >
            <Form.Item
              name="redisKey"
              label='Key'
            >
              <Input disabled style={{ width: '100%', backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontSize: '16px' }} />
            </Form.Item>
          </Form>
        </div>
        <div style={{ float: 'right' }}>
          <Space size='large' style={{ height: '20%', textAlign: 'center' }}>
            <Button type="primary" onClick={onRedisValueUpdate}>保存</Button>
            <Button type="primary" >重命名</Button>
            <Button type="primary" >删除</Button>
            <Button type="primary" >设置TTL</Button>
            <Button type="primary" >刷新</Button>
          </Space>
        </div>
      </div>
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
    </Card>
  );
};

export default ValueDisplayCard;
