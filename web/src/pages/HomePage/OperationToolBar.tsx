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
  handleDataModalVisible;
  handleRemoveRedisConnection;
  refreshCurrentConnectionDatabase;
  refreshCurrentDatabaseKeys;
  clearExpanded;
  clearSelected;
  loadAllRedisConnection;
};

const OperationToolBar: React.FC<OperationToolBarProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const {
    form,
    currentTreeNode,
    onTreeNodeFold,
    setConnectionModalType,
    handleConnectionModalVisible,
    handleDataModalVisible,
    handleRemoveRedisConnection,
    refreshCurrentConnectionDatabase,
    refreshCurrentDatabaseKeys,
    clearExpanded,
    clearSelected,
    loadAllRedisConnection
  } = props;

  const getOperationToolBar = () => {
    if (currentTreeNode && currentTreeNode.level === 1) {
      return (
        <Space size='large' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
          <Button title='编辑'
            onClick={() => {
              confirm({
                title: '编辑确认',
                icon: <ExclamationCircleOutlined />,
                content: '编辑连接信息需要关闭所有连接，是否继续 ？',
                onOk() {
                  clearExpanded();
                  form.setFieldsValue(currentTreeNode.redisConnectionVo);
                  setConnectionModalType(ModalType.Update)
                  handleConnectionModalVisible(true);
                },
                onCancel() {
                },
              });
            }}
            type="primary" icon={<EditOutlined />} />
          <Button title='删除'
            onClick={() => {
              confirm({
                title: '删除确认',
                icon: <ExclamationCircleOutlined />,
                content: '此操作不可恢复，是否继续 ？',
                onOk() {
                  onTreeNodeFold(currentTreeNode.key)
                  handleRemoveRedisConnection(currentTreeNode);
                },
                onCancel() {
                },
              });
            }} type="primary" icon={<DeleteOutlined />} />
          <Button title='刷新'
            onClick={() => {
              refreshCurrentConnectionDatabase()
            }} type="primary" icon={<RedoOutlined />} />
        </Space>
      )
    } else if (currentTreeNode && currentTreeNode.level === 2) {
      return (
        <Space size='large' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
          <Button title='新增'
            onClick={() => {
              form.setFieldsValue(currentTreeNode.redisConnectionVo);
              setConnectionModalType(ModalType.Update)
              handleDataModalVisible(true);
            }}
            type="primary"
            icon={<FileAddOutlined />} />
          <Button title='刷新'
            onClick={
              () => {
                refreshCurrentDatabaseKeys()
              }}
            type="primary" icon={<RedoOutlined />} />
        </Space>
      )
    } else if (currentTreeNode && currentTreeNode.level === 3) {
      return (
        <Space size='large' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
        </Space>
      )
    } else {
      return (
        <Space size='large' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
          <Search placeholder="请输入" enterButton />
          <Button title='刷新'
            onClick={() => {
              confirm({
                title: '刷新确认',
                icon: <ExclamationCircleOutlined />,
                content: '该操作会关闭所有连接，是否继续 ？',
                onOk() {
                  clearExpanded();
                  clearSelected
                  loadAllRedisConnection();
                },
                onCancel() {
                },
              });
            }}
            type="primary" icon={<RedoOutlined />} />
        </Space>
      )
    }
  }

  return (
    getOperationToolBar()
  );
};

export default OperationToolBar;
