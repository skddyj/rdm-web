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

export type OperationToolBarProps = {
  form;
  currentTreeNode;
  onTreeNodeFold;
  setConnectionModalType;
  handleConnectionModalVisible;
  refreshConnection;
  handleRemoveRedisConnection;
};

const RedisConnectionModal: React.FC<OperationToolBarProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentTreeNode,
    onTreeNodeFold,
    setConnectionModalType,
    handleConnectionModalVisible,
    refreshConnection,
    handleRemoveRedisConnection
  } = props;

  const getOperationToolBar = () => {
    if (currentTreeNode && currentTreeNode.level === 1) {
      return (
        <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
          <Button title='编辑'
            onClick={() => {
              onTreeNodeFold(currentTreeNode.key)
              form.setFieldsValue(currentTreeNode.redisConnectionVo);
              setConnectionModalType(ModalType.Update)
              handleConnectionModalVisible(true);
            }}
            type="primary" icon={<EditOutlined />} />
          <Button title='删除'
            onClick={() => {
              confirm({
                title: '删除确认',
                icon: <ExclamationCircleOutlined />,
                content: '此操作不可恢复，确认删除吗 ？',
                onOk() {
                  onTreeNodeFold(currentTreeNode.key)
                  handleRemoveRedisConnection([currentTreeNode]).then((success) => {
                    if (success) {
                      refreshConnection();
                    }
                  });
                },
                onCancel() {
                },
              });
            }} type="primary" icon={<DeleteOutlined />} />
          <Button title='刷新' type="primary" icon={<RedoOutlined />} />
        </Space>
      )
    } else if (currentTreeNode && currentTreeNode.level === 2) {
      return (
        <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
          <Button title='新增' type="primary" icon={<FileAddOutlined />} style={{ marginLeft: 10 }} />
          <Button title='编辑' type="primary" icon={<EditOutlined />} style={{ marginLeft: 10 }} />
          <Button title='删除' type="primary" icon={<DeleteOutlined />} style={{ marginLeft: 10 }} />
          <Button title='刷新' type="primary" icon={<RedoOutlined />} style={{ marginLeft: 10 }} />
        </Space>
      )
    } else {
      return (
        <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
        </Space>
      )
    }
  }

  return (
    getOperationToolBar()
  );
};

export default RedisConnectionModal;
