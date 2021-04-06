import React from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Row, Col } from 'antd';
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
  expandedKeys;
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
    loadAllRedisConnection,
    expandedKeys
  } = props;

  const getOperationToolBar = () => {
    if (currentTreeNode && currentTreeNode.level === 1) {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 4 }}>
          <Col span={8}>
            <Button title='编辑'
              style={{ width: '100%' }}
              onClick={() => {
                if (expandedKeys && expandedKeys.length > 0) {
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
                } else {
                  clearExpanded();
                  form.setFieldsValue(currentTreeNode.redisConnectionVo);
                  setConnectionModalType(ModalType.Update)
                  handleConnectionModalVisible(true);
                }
              }}
              type="primary" icon={<EditOutlined />} >
            </Button>
          </Col>
          <Col span={8}>
            <Button title='删除'
              style={{ width: '100%' }}
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
              }} type="primary" icon={<DeleteOutlined />} >
            </Button>
          </Col>
          <Col span={8}>
            <Button title='刷新'
              style={{ width: '100%' }}
              onClick={() => {
                refreshCurrentConnectionDatabase()
              }} type="primary" icon={<RedoOutlined />} >

            </Button>
          </Col>
        </Row>
      )
    } else if (currentTreeNode && currentTreeNode.level === 2) {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 4 }}>
          <Col span={12}>
            <Button title='新增'
              style={{ width: '100%' }}
              onClick={() => {
                form.setFieldsValue(currentTreeNode.redisConnectionVo);
                setConnectionModalType(ModalType.Update)
                handleDataModalVisible(true);
              }}
              type="primary"
              icon={<FileAddOutlined />} >
            </Button>
          </Col>
          <Col span={12}>
            <Button title='刷新'
              style={{ width: '100%' }}
              onClick={
                () => {
                  refreshCurrentDatabaseKeys()
                }}
              type="primary" icon={<RedoOutlined />} >
            </Button>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 4 }}>
          <Col span={24} >
            <Button title='刷新'
              style={{ width: '100%' }}
              onClick={() => {
                if (expandedKeys && expandedKeys.length > 0) {
                  confirm({
                    title: '刷新确认',
                    icon: <ExclamationCircleOutlined />,
                    content: '该操作会关闭所有连接，是否继续 ？',
                    onOk() {
                      clearExpanded();
                      clearSelected();
                      loadAllRedisConnection();
                    },
                    onCancel() {
                    },
                  });
                } else {
                  clearExpanded();
                  clearSelected();
                  loadAllRedisConnection();
                }
              }}
              type="primary" icon={<RedoOutlined />} >

            </Button>
          </Col>
        </Row>
      )
    }
  }

  return (
    getOperationToolBar()
  );
};

export default OperationToolBar;
