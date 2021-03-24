import React, { useEffect } from 'react';
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

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};


export type ValueDisplayCardProps = {
  form;
  currentRedisKey;
  currentTreeNode;
  currentRedisResult;
  onRedisValueUpdate;
  handleRemoveRedisKey;
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentRedisKey,
    currentTreeNode,
    currentRedisResult,
    onRedisValueUpdate,
    handleRemoveRedisKey
  } = props;


  useEffect(() => {
    form.setFieldsValue({ redisKey: currentRedisKey })
  }, [currentRedisKey]);

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

  const getRedisKeyFormLabel = (currentRedisResult) => {
    if (currentRedisResult) {
      if (currentRedisResult.type === 'string') {
        return <b>String</b>;
      } else if (currentRedisResult.type === 'list') {
        return <b>List</b>;
      } else if (currentRedisResult.type === 'set') {
        return <b>Set</b>;
      } else if (currentRedisResult.type === 'zset') {
        return <b>ZSet</b>;
      } else if (currentRedisResult.type === 'hash') {
        return <b>Hash</b>;
      } else {
        return <b>Key</b>;
      }
    } else {
      return <b>Key</b>;
    }
  }

  const removeRedisKey = () => {
    const { connectionId, databaseId, level } = currentTreeNode;
    if (level && level === 3) {
      const data = { connectionId, databaseId, key: currentRedisKey }
      confirm({
        title: '删除确认',
        icon: <ExclamationCircleOutlined />,
        content: '此操作不可恢复，确认删除吗 ？',
        onOk() {
          handleRemoveRedisKey(data)
        },
        onCancel() {
        },
      });
    } else {
      message.info('请选择一个Key！', 3);
    }

  }


  return (
    <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }} bordered={false}>
      <div style={{ height: '40px' }}>
        <div style={{ float: 'left', width: '50%' }}>
          <Form
            {...layout}
            form={form}
            name="redisKeyForm"
          >
            <Form.Item
              name="redisKey"
              label={getRedisKeyFormLabel(currentRedisResult)}
            >
              <Input size='middle' disabled style={{ width: '100%', backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} />
            </Form.Item>
          </Form>
        </div>
        <div style={{ float: 'right' }}>
          <Space size='large' style={{ height: '20%', textAlign: 'center' }}>
            <Button type="primary" onClick={onRedisValueUpdate}>保存</Button>
            <Button type="primary" >重命名</Button>
            <Button type="primary"
              onClick={() => {
                removeRedisKey()
              }}>删除</Button>
            <Button type="primary" >设置TTL</Button>
            <Button type="primary" >刷新</Button>
          </Space>
        </div>
      </div>
      <div style={{ height: 'calc(100% - 52px)', display: 'block', float: 'none' }}>
        {getValueDisplayArea(currentRedisResult)}
      </div>
    </Card >
  );
};

export default ValueDisplayCard;
