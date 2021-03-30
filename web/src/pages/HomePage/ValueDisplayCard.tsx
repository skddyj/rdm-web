import React, { useEffect, useState } from 'react';
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
  ReloadOutlined,
  SettingOutlined,
  SaveOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import StringValueDisplayArea from './StringValueDisplayArea';
import ListValueDisplayArea from './ListValueDisplayArea';
import SetValueDisplayArea from './SetValueDisplayArea';
import ZSetValueDisplayArea from './ZSetValueDisplayArea';
import RedisDataRenameModal from './RedisDataRenameModal';
import HashValueDisplayArea from './HashValueDisplayArea';
import RedisDataTtlModal from './RedisDataTtlModal';
import { queryKeyAttr } from './service';

const { TextArea, Search } = Input;
const { confirm } = Modal;

export enum ModalType { Create, Update };

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};


export type ValueDisplayCardProps = {
  form;
  currentTreeNode;
  onRedisValueUpdate;
  handleRemoveRedisKey;
  handleRenameRedisKey;
  handleRefreshRedisValue;
  handleExpireRedisKey;
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentTreeNode,
    onRedisValueUpdate,
    handleRemoveRedisKey,
    handleRenameRedisKey,
    handleRefreshRedisValue,
    handleExpireRedisKey
  } = props;

  const [dataRenameModalVisible, handleDataRenameModalVisible] = useState<boolean>(false);

  const [dataTtlModalVisible, handleDataTtlModalVisible] = useState<boolean>(false);

  const [currentRedisKeyAttr, setCurrentRedisKeyAttr] = useState();


  useEffect(() => {
    if (currentTreeNode && currentTreeNode.level === 3) {
      getKeyAttr().then((attr) => {
        const { key, ttl } = attr;
        setCurrentRedisKeyAttr(attr);
        console.log("setCurrentRedisKeyAttr", attr)
        form.setFieldsValue({ redisKey: key, ttl })
      });
    } else {
      form.resetFields()
    }
  }, [currentTreeNode]);

  const getKeyAttr = async () => {
    const { connectionId, databaseId, redisKey } = currentTreeNode
    try {
      return await queryKeyAttr({ connectionId, databaseId, key: redisKey }).then((response) => {
        if (response && response.success) {
          return response.result;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      message.error('查询Key属性失败');
    }
  }

  const stringValueDisplayArea = (
    <StringValueDisplayArea
      currentTreeNode={currentTreeNode}
    />
  );

  const listValueDisplayArea = (
    <ListValueDisplayArea
      currentTreeNode={currentTreeNode}
    />
  );

  const setValueDisplayArea = (
    <SetValueDisplayArea
      currentTreeNode={currentTreeNode}
    />
  );

  const zsetValueDisplayArea = (
    <ZSetValueDisplayArea
      currentTreeNode={currentTreeNode}
    />
  );

  const hashValueDisplayArea = (
    <HashValueDisplayArea
      currentTreeNode={currentTreeNode}
    />
  );

  const empty = <Empty style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;

  const getValueDisplayArea = (treeNode, redisKeyAttr) => {
    if (treeNode && treeNode.level === 3) {
      if (redisKeyAttr && redisKeyAttr.type === 'string') {
        return stringValueDisplayArea;
      } else if (redisKeyAttr && redisKeyAttr.type === 'list') {
        return listValueDisplayArea;
      } else if (redisKeyAttr && redisKeyAttr.type === 'set') {
        return setValueDisplayArea;
      } else if (redisKeyAttr && redisKeyAttr.type === 'zset') {
        return zsetValueDisplayArea;
      } else if (redisKeyAttr && redisKeyAttr.type === 'hash') {
        return hashValueDisplayArea;
      }
      return empty;
    } else {
      return empty;
    }
  }


  const defaultKey = <b>Key</b>;


  const getRedisKeyFormLabel = (treeNode, redisKeyAttr) => {
    console.log("getRedisKeyFormLabel", treeNode, redisKeyAttr)
    if (treeNode && treeNode.level === 3) {
      if (redisKeyAttr && redisKeyAttr.type === 'string') {
        return <b>String</b>;
      } else if (redisKeyAttr && redisKeyAttr.type === 'list') {
        return <b>List</b>;
      } else if (redisKeyAttr && redisKeyAttr.type === 'set') {
        return <b>Set</b>;
      } else if (redisKeyAttr && redisKeyAttr.type === 'zset') {
        return <b>ZSet</b>;
      } else if (redisKeyAttr && redisKeyAttr.type === 'hash') {
        return <b>Hash</b>;
      }
      return defaultKey;
    } else {
      return defaultKey;
    }
  }

  const removeRedisKey = () => {
    if (currentTreeNode && currentTreeNode.level && currentTreeNode.level === 3) {
      const { connectionId, databaseId, redisKey } = currentTreeNode;
      const data = { connectionId, databaseId, key: redisKey }
      confirm({
        title: '删除确认',
        icon: <ExclamationCircleOutlined />,
        content: '此操作不可恢复，是否继续 ？',
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
      <div style={{ height: '32px' }}>
        <Form
          style={{ float: 'left', width: '40%' }}
          layout="inline"
          {...layout}
          form={form}
          name="redisKeyForm"
        >
          <Form.Item
            style={{ width: '100%' }}
            name="redisKey"
            label={getRedisKeyFormLabel(currentTreeNode, currentRedisKeyAttr)}
          >
            <Input disabled style={{ backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} />
          </Form.Item>
        </Form>
        <Form
          style={{ float: 'left', width: '20%' }}
          layout="inline"
          {...layout}
          form={form}
          name="redisKeyTtlForm"
        >
          <Form.Item
            name="ttl"
            label={<b>TTL</b>}
          >
            <Input disabled style={{ backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} />
          </Form.Item>
        </Form>
        <div style={{ float: 'left', width: 'calc(40% - 20px)', marginLeft: '20px' }}>
          <Space style={{ height: '20%', textAlign: 'center' }}>
            <Button type="primary"
              onClick={onRedisValueUpdate}
              icon={<SaveOutlined />}
            >保存</Button>
            <Button type="primary"
              icon={<FormOutlined />}
              onClick={() => {
                if (currentTreeNode && currentTreeNode.level && currentTreeNode.level === 3) {
                  handleDataRenameModalVisible(true);
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }}>重命名</Button>
            <Button type="primary"
              icon={<DeleteOutlined />}
              onClick={() => {
                removeRedisKey()
              }}>删除</Button>
            <Button type="primary"
              icon={<SettingOutlined />}
              onClick={() => {
                if (currentTreeNode && currentTreeNode.level && currentTreeNode.level === 3) {
                  handleDataTtlModalVisible(true);
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }}>设置TTL</Button>
            <Button type="primary"
              icon={<ReloadOutlined />}
              onClick={() => {
                if (currentTreeNode && currentTreeNode.level && currentTreeNode.level === 3) {
                  handleRefreshRedisValue(currentTreeNode);
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }} >刷新</Button>
          </Space>
        </div>
      </div>
      <div style={{ marginTop: '20px', height: 'calc(100% - 52px)', display: 'block', float: 'none' }}>
        {getValueDisplayArea(currentTreeNode, currentRedisKeyAttr)}
      </div>
      <RedisDataRenameModal
        currentTreeNode={currentTreeNode}
        handleRenameRedisKey={handleRenameRedisKey}
        handleDataRenameModalVisible={handleDataRenameModalVisible}
        dataRenameModalVisible={dataRenameModalVisible}
      />
      <RedisDataTtlModal
        currentTreeNode={currentTreeNode}
        handleExpireRedisKey={handleExpireRedisKey}
        handleDataTtlModalVisible={handleDataTtlModalVisible}
        dataTtlModalVisible={dataTtlModalVisible}
      />
    </Card >

  );
};

export default ValueDisplayCard;
