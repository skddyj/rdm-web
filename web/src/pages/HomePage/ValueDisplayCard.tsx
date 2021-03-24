import React from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Empty, Tooltip, Space, Breadcrumb } from 'antd';
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
import StringValueDisplayArea from './StringValueDisplayArea';
import ListValueDisplayArea from './ListValueDisplayArea';

const { TextArea, Search } = Input;
const { confirm } = Modal;

export enum ModalType { Create, Update };

export type ValueDisplayCardProps = {
  form;
  currentRedisKey;
  currentTreeNode;
  currentRedisResult;
  onRedisValueUpdate;
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentRedisKey,
    currentTreeNode,
    currentRedisResult,
    onRedisValueUpdate
  } = props;

  const stringValueDisplayArea = (
    <StringValueDisplayArea
      form={form}
      currentRedisKey={currentRedisKey}
      currentTreeNode={currentTreeNode}
      currentRedisResult={currentRedisResult}
    />
  );

  const listValueDisplayArea = (
    <ListValueDisplayArea
      form={form}
      currentRedisKey={currentRedisKey}
      currentTreeNode={currentTreeNode}
      currentRedisResult={currentRedisResult}
    />
  );

  const getValueDisplayArea = (currentRedisResult) => {
    if (currentRedisResult) {
      if (currentRedisResult.type === 'string') {
        return stringValueDisplayArea;
      } else if (currentRedisResult.type === 'list') {
        return listValueDisplayArea;
      } else {
        return <Empty style={{ verticalAlign: 'center' }} />;
      }
    } else {
      return <Empty style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;
    }
  }


  return (
    <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }} bordered={false}>
      <div style={{ height: '52px' }}>
        <div style={{ float: 'left', width: '50%' }}>
          <Form
            form={form}
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
      <div style={{ height: 'calc(100% - 52px)', display: 'block' }}>
        {getValueDisplayArea(currentRedisResult)}
      </div>
    </Card >
  );
};

export default ValueDisplayCard;
