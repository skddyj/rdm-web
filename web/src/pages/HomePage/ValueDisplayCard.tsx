import React, { useEffect, useState } from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Empty, Tooltip, Space, Breadcrumb, Row, Col } from 'antd';
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
  currentRedisKey;
  handleRemoveRedisKey;
  handleRenameRedisKey;
  handleExpireRedisKey;
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> =React.forwardRef<HomeRefProps, InfiniteScrollListProps> ((props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentTreeNode,
    currentRedisKey,
    handleRemoveRedisKey,
    handleRenameRedisKey,
    handleExpireRedisKey
  } = props;

  const [dataRenameModalVisible, handleDataRenameModalVisible] = useState<boolean>(false);

  const [dataTtlModalVisible, handleDataTtlModalVisible] = useState<boolean>(false);

  const [currentRedisKeyAttr, setCurrentRedisKeyAttr] = useState();


  useEffect(() => {
    if (currentTreeNode && currentRedisKey) {
      getKeyAttr().then((attr) => {
        const { key, ttl } = attr;
        setCurrentRedisKeyAttr(attr);
        form.setFieldsValue({ redisKey: key, ttl })
      });
    } else {
      form.resetFields()
    }
  }, [currentRedisKey]);

  const handleRefreshRedisValue=()=>{
    getKeyAttr().then((attr) => {
      const { key, ttl } = attr;
      setCurrentRedisKeyAttr(attr);
      form.setFieldsValue({ redisKey: key, ttl })
    });
  }

  const getKeyAttr = async () => {
    const { connectionId, databaseId } = currentTreeNode
    try {
      return await queryKeyAttr({ connectionId, databaseId, key: currentRedisKey }).then((response) => {
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
      currentRedisKey={currentRedisKey}
    />
  );

  const listValueDisplayArea = (
    <ListValueDisplayArea
      currentTreeNode={currentTreeNode}
      currentRedisKey={currentRedisKey}
    />
  );

  const setValueDisplayArea = (
    <SetValueDisplayArea
      currentTreeNode={currentTreeNode}
      currentRedisKey={currentRedisKey}
    />
  );

  const zsetValueDisplayArea = (
    <ZSetValueDisplayArea
      currentTreeNode={currentTreeNode}
      currentRedisKey={currentRedisKey}
    />
  );

  const hashValueDisplayArea = (
    <HashValueDisplayArea
      currentTreeNode={currentTreeNode}
      currentRedisKey={currentRedisKey}
    />
  );

  const empty = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />;

  const getValueDisplayArea = (currentRedisKey, redisKeyAttr) => {
    if (currentRedisKey) {
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
    if (currentRedisKey) {
      const { connectionId, databaseId } = currentTreeNode;
      const data = { connectionId, databaseId, key: currentRedisKey }
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
        <div style={{ float: 'left', width: '60%', display: 'inline-block' }}>
          <Form
            style={{ float: 'left', width: '65%' }}
            layout="inline"
            {...layout}
            form={form}
            name="redisKeyForm"
          >
            <Form.Item
              style={{ width: '100%' }}
              name="redisKey"
              label={getRedisKeyFormLabel(currentRedisKey, currentRedisKeyAttr)}
            >
              <Input disabled style={{ backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} />
            </Form.Item>
          </Form>
          <Form
            style={{ float: 'left', width: '35%' }}
            layout="inline"
            {...layout}
            form={form}
            name="redisKeyTtlForm"
          >
            <Form.Item
              style={{ width: '100%' }}
              name="ttl"
              label={<b>TTL</b>}
            >
              <Input disabled style={{ backgroundColor: '#fff', cursor: 'text', color: 'rgba(0, 0, 0, 0.85)', fontWeight: 'bold' }} />
            </Form.Item>
          </Form>
        </div>
        <Row gutter={{ xs: 4, sm: 4, md: 4, lg: 4 }} style={{ float: 'right', width: 'calc(40% - 20px)', marginLeft: '20px' }}>
          <Col span={6}>
            <Button type="primary"
              style={{ width: '100%' }}
              icon={<FormOutlined />}
              onClick={() => {
                if (currentRedisKey) {
                  handleDataRenameModalVisible(true);
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }}>重命名
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary"
              style={{ width: '100%' }}
              icon={<DeleteOutlined />}
              onClick={() => {
                removeRedisKey()
              }}>删除
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary"
              style={{ width: '100%' }}
              icon={<SettingOutlined />}
              onClick={() => {
                if (currentRedisKey) {
                  handleDataTtlModalVisible(true);
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }}>设置TTL
            </Button>
          </Col>
          <Col span={6}>
            <Button type="primary"
              style={{ width: '100%' }}
              icon={<ReloadOutlined />}
              onClick={() => {
                if (currentRedisKey) {
                  handleRefreshRedisValue();
                } else {
                  message.info('请选择一个Key！', 3);
                }
              }} >刷新
            </Button>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: '20px', height: 'calc(100% - 52px)', display: 'block', float: 'none' }}>
        {getValueDisplayArea(currentRedisKey, currentRedisKeyAttr)}
      </div>
      <RedisDataRenameModal
        currentTreeNode={currentTreeNode}
        currentRedisKey={currentRedisKey}
        handleRenameRedisKey={handleRenameRedisKey}
        handleDataRenameModalVisible={handleDataRenameModalVisible}
        dataRenameModalVisible={dataRenameModalVisible}
        handleRefreshRedisValue={handleRefreshRedisValue}
      />
      <RedisDataTtlModal      
        currentTreeNode={currentTreeNode}
        currentRedisKey={currentRedisKey}
        handleExpireRedisKey={handleExpireRedisKey}
        handleDataTtlModalVisible={handleDataTtlModalVisible}
        dataTtlModalVisible={dataTtlModalVisible}
        handleRefreshRedisValue={handleRefreshRedisValue}
      />
    </Card >

  );
});

export default ValueDisplayCard;
