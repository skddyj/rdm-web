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
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { format } from 'prettier';

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
  refreshCurrentConnection;
  refreshCurrentDatabase;
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
    refreshCurrentConnection,
    refreshCurrentDatabase,
    clearExpanded,
    clearSelected,
    loadAllRedisConnection,
    expandedKeys
  } = props;

  const getOperationToolBar = () => {
    if (currentTreeNode && currentTreeNode.level === 1) {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 2 }}>
          <Col span={8}>
            <Button title={formatMessage({ "id": "button.redis.connection.edit" })}
              style={{ width: '100%' }}
              onClick={() => {
                if (expandedKeys && expandedKeys.length > 0) {
                  confirm({
                    title: (formatMessage({ "id": "modal.redis.connection.edit.confirm.title" })),
                    icon: <ExclamationCircleOutlined />,
                    content: (formatMessage({ "id": "modal.redis.connection.edit.confirm.content" })),
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
            <Button title={formatMessage({ "id": "button.redis.connection.delete" })}
              style={{ width: '100%' }}
              onClick={() => {
                confirm({
                  title: (formatMessage({ "id": "modal.redis.connection.delete.confirm.title" })),
                  icon: <ExclamationCircleOutlined />,
                  content: (formatMessage({ "id": "modal.redis.connection.delete.confirm.content" })),
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
            <Button title={formatMessage({ "id": "button.redis.connection.refresh" })}
              style={{ width: '100%' }}
              onClick={() => {
                refreshCurrentConnection()
              }} type="primary" icon={<SyncOutlined />} >

            </Button>
          </Col>
        </Row>
      )
    } else if (currentTreeNode && currentTreeNode.level === 2) {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 2 }}>
          <Col span={12}>
            <Button title={formatMessage({ "id": "button.redis.key.new" })}
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
            <Button title={formatMessage({ "id": "button.common.refresh" })}
              style={{ width: '100%' }}
              onClick={
                () => {
                  refreshCurrentDatabase()
                }}
              type="primary" icon={<SyncOutlined />} >
            </Button>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32, marginRight: 2 }}>
          <Col span={24} >
            <Button title={formatMessage({ "id": "button.redis.connection.refresh" })}
              style={{ width: '100%' }}
              onClick={() => {
                if (expandedKeys && expandedKeys.length > 0) {
                  confirm({
                    title: (formatMessage({ "id": "modal.redis.connection.refresh.confirm.title" })),
                    icon: <ExclamationCircleOutlined />,
                    content: (formatMessage({ "id": "modal.redis.connection.refresh.confirm.content" })),
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
              type="primary" icon={<SyncOutlined />} >

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
