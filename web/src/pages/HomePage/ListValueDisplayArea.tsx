import React, { useState, useRef } from 'react';
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

import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  PlusOutlined,
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

/**
 * 更新Redis Key对应Value
 */
const handleListItemAdd = async (fields) => {
  const hide = message.loading('正在更新');
  try {
    return await setKeyValue(fields).then((response) => {
      if (response && response.success) {
        hide();
        message.success('更新成功');
        return true;
      }
      throw new Error(response.message);
    });
  } catch (error) {
    hide();
    message.error(`更新失败，请重试，失败原因：${error}`);
    return false;
  }
};

/**
 * 更新Redis Key对应Value
 */
const handleListItemUpdate = async (fields) => {
  const hide = message.loading('正在更新');
  try {
    return await setKeyValue(fields).then((response) => {
      if (response && response.success) {
        hide();
        message.success('更新成功');
        return true;
      }
      throw new Error(response.message);
    });
  } catch (error) {
    hide();
    message.error(`更新失败，请重试，失败原因：${error}`);
    return false;
  }
};

const ValueDisplayCard: React.FC<ValueDisplayCardProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();
  const form = Form.useForm()[0];

  const {
    textAreaForm,
    currentRedisKey,
    currentTreeNode,
    onRedisValueUpdate
  } = props;

  /** 新建窗口的弹窗 */
  const [createListItemModalVisible, handleCreateListItemModalVisible] = useState<boolean>(false);
  const [createListItemModalType, setCreateListItemModalType] = useState<ModalType>(ModalType.Create);

  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'id',
      width: '25%',
      title: (
        <FormattedMessage
          id="pages.redisConnectionManage.id"
          defaultMessage="连接ID"
        />
      ),
      tip: '连接ID是唯一的key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      dataIndex: 'name',
      title: <FormattedMessage id="pages.redisConnectionManage.name" defaultMessage="连接名称" />,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (dom, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            form.setFieldsValue(record);
            setModalType(ModalType.Update)
            setShowDetail(false)
            handleModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.redisConnectionManage.update" defaultMessage="修改" />
        </a>
      ],
    },
  ];

  return (
    <div style={{ height: '80%', textAlign: 'right' }}>
      <ProTable
        rowKey="id"
        search={{
          labelWidth: 120,
        }}

        pagination={{
          defaultCurrent: 1, pageSize: 10,
          //onChange: () => queryRedisConnection({})
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateListItemModalType(ModalType.Create)
              handleCreateListItemModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        columns={columns}
      />
      <Modal
        title={formatMessage({
          id: createListItemModalType === ModalType.Create ? 'pages.redisConnectionManage.createForm.newRedisConnection' : 'pages.redisConnectionManage.createForm.updateRedisConnection',
          defaultMessage: createListItemModalType === ModalType.Create ? '添加行' : '修改行',
        })}
        width="600px"
        destroyOnClose
        visible={createListItemModalVisible}
        footer={[
          <Button key="back" onClick={() => {
            form.resetFields();
            handleCreateListItemModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            form
              .validateFields()
              .then(values => {
                console.log("values222", values)
                form.resetFields();
                if (createListItemModalType === ModalType.Create) {
                  handleListItemAdd(values).then((success) => {
                    console.log("success", success);
                    if (success) {
                      refreshConnection();
                      handleConnectionModalVisible(false);
                    }
                  });
                } else if (createListItemModalType === ModalType.Update) {
                  handleListItemUpdate({ id: currentRow?.id, ...values }).then((success) => {
                    console.log("success", success);
                    if (success) {
                      refreshConnection();
                      handleConnectionModalVisible(false);
                    }
                  });
                }
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
            确定
          </Button>,
        ]}
        onCancel={() => {
          form.resetFields();
          handleListValueModalVisible(false);
        }}
      >
        <Form
          {...layout}
          layout="horizontal"
          form={form}
          name="form_in_modal"
        >
          <Form.Item
            name="name"
            label="连接名称"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.name"
                    defaultMessage="连接名称为必填项"
                  />
                ),
              },
            ]}
          >
            <TextArea placeholder='请输入连接名称'
            // disabled={connectionModalType === ModalType.Update}
            />
          </Form.Item >
        </Form>
      </Modal>
    </div>
  );
};

export default ValueDisplayCard;
