import { PlusOutlined, SoundTwoTone } from '@ant-design/icons';
import { Modal, Button, message, Input, Drawer, Row, Col, Form, InputNumber } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { RedisConnectionParams, TableListItem } from './data.d';
import { queryRedisConnection, updateRedisConnection, addRedisConnection, removeRedisConnection, testRedisConnection } from './service';

enum ModalType { Create, Update };

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

/**
 * 添加连接
 */
const handleAdd = async (fields: RedisConnectionParams) => {
  const hide = message.loading('正在添加');
  try {
    await addRedisConnection({ ...fields }).then((response) => {
      console.log("response", response)
      if (response && response.success) {
        return response.result;
      }
      throw new Error(response.message);
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error(`添加失败，请重试，失败原因：${error}`);
    return false;
  }
};


/**
 * 修改连接
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateRedisConnection({
      ...fields
    }).then((response) => {
      if (response && response.success) {
        return response.result;
      }
      throw new Error(response.message);
    });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error(`修改失败，请重试，失败原因：${error}`);
    return false;
  }
};

/**
 * 删除连接
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const keys = selectedRows.map((row) => row.id)
    await removeRedisConnection(keys).then((response) => {
      if (response && response.success) {
        return response.result;
      }
      throw new Error(response.message);
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error(`删除失败，请重试，失败原因：${error}`);
    return false;
  }
};

/**
 * 测试连接
 */
const handleTestConnection = async (fields: RedisConnectionParams) => {
  const hide = message.loading('正在测试连接');
  try {
    await testRedisConnection(fields).then((response) => {
      if (response && response.success) {
        console.log(response)
        return response.result;
      }
      throw new Error(response.message);
    });
    hide();
    message.success('连接成功');
    return true;
  } catch (error) {
    hide();
    message.error('连接失败，请检查配置');
    return false;
  }
};

const TableList: React.FC = () => {
  // form
  const [form] = Form.useForm();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.Create);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  /** 国际化配置 */
  const intl = useIntl();

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
      dataIndex: 'host',
      title: <FormattedMessage id="pages.redisConnectionManage.host" defaultMessage="连接地址" />,
      sorter: true,
      hideInForm: true
    },
    {
      title: <FormattedMessage id="pages.redisConnectionManage.port" defaultMessage="连接端口" />,
      dataIndex: 'port',
      valueType: 'digit',
      sorter: true,
      hideInForm: true
    },
    {
      dataIndex: 'password',
      title: <FormattedMessage id="pages.redisConnectionManage.password" defaultMessage="连接密码" />,
      hideInForm: true
    },
    {
      title: (
        <FormattedMessage id="pages.redisConnectionManage.username" defaultMessage="连接用户名" />
      ),
      sorter: true,
      dataIndex: 'username',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');
        if (`${status}` === '0') {
          return false;
        }
        if (`${status}` === '3') {
          return (
            <Input
              {...rest}
              placeholder={intl.formatMessage({
                id: 'pages.searchTable.exception',
                defaultMessage: '请输入异常原因！',
              })}
            />
          );
        }
        return defaultRender(item);
      },
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
    <PageContainer>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'pages.redisConnectionManage.searchTable.title',
          defaultMessage: '所有连接信息',
        })}
        actionRef={actionRef}
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
              setModalType(ModalType.Create)
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={(params, sorter, filter) => {
          return queryRedisConnection({ ...params }, sorter, filter).then((response) => {
            if (response && response.success) {
              console.log(response.result)
              return response.result;
            }
            message.error(response.message)
          })
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="服务调用次数总计"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
          {/* <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="批量审批" />
          </Button> */}
        </FooterToolbar>
      )}
      <Modal
        title={intl.formatMessage({
          id: 'pages.redisConnectionManage.createForm.newRedisConnection',
          defaultMessage: '新建Redis连接',
        })}
        width="600px"
        destroyOnClose
        visible={createModalVisible}
        footer={[
          <Button key="testConnection" onClick={() => {
            form
              .validateFields()
              .then(values => {
                handleTestConnection(values as RedisConnectionParams);
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
            测试连接
          </Button>,
          <Button key="back" onClick={() => {
            form.resetFields();
            handleModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            form
              .validateFields()
              .then(values => {
                form.resetFields();
                let success;
                if (modalType === ModalType.Create) {
                  success = handleAdd(values as RedisConnectionParams);
                } else if (modalType === ModalType.Update) {
                  success = handleUpdate({ id: currentRow?.id, ...values } as RedisConnectionParams);
                }
                if (success) {
                  handleModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
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
          handleModalVisible(false);
        }}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              let success;
              if (modalType === ModalType.Create) {
                success = handleAdd(values as RedisConnectionParams);
              } else if (modalType === ModalType.Update) {
                success = handleUpdate({ id: currentRow?.id, ...values } as RedisConnectionParams);
              }
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
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
            <Input />
          </Form.Item >
          <Form.Item
            name="host"
            label="连接地址"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.host"
                    defaultMessage="连接地址为必填项"
                  />
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="port"
            label="连接端口"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.port"
                    defaultMessage="连接端口为必填项"
                  />
                ),
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="连接密码"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.password"
                    defaultMessage="连接密码为必填项"
                  />
                ),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="连接用户名"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer >
  );
};

export default TableList;
