import React, { useEffect, useState, useRef } from 'react';
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
  EditOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  RedoOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { queryRedisValue, addRedisValue, updateRedisValue, removeRedisValue } from './service'
import { ModalType } from './HashValueDisplayArea';

const { TextArea, Search } = Input;
const { confirm } = Modal;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export enum ListRowModalType { Create, Update };

export type ListValueDisplayAreaProps = {
  currentTreeNode;
  currentRedisKey;
};


const ListValueDisplayArea: React.FC<ListValueDisplayAreaProps> = (props) => {
  const {
    currentTreeNode,
    currentRedisKey,
  } = props;

  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const actionRef = useRef<ActionType>();

  const [currentListRow, setCurrentListRow] = useState();

  const [listRowModalType, setListRowModalType] = useState<ListRowModalType>(ListRowModalType.Create);

  const [listAddRowModalVisible, handleListAddRowModalVisible] = useState(false);

  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  }, [currentRedisKey]);

  /**
   * 添加Redis Value
   */
  const handleAddRedisValue = async (fields) => {
    const hide = message.loading('正在添加');
    try {
      return await addRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('添加成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`添加失败，请重试，失败原因：${error}`);
      return false;
    }
  };

  /**
 * 修改Redis Value
 */
  const handleUpdateRedisValue = async (fields) => {
    const hide = message.loading('正在修改');
    try {
      return await updateRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('修改成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`修改失败，请重试，失败原因：${error}`);
      return false;
    }
  };

  /**
 * 修改Redis Value
 */
  const handleRemoveRedisValue = async (fields) => {
    const hide = message.loading('正在删除');
    try {
      return await removeRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`删除失败，请重试，失败原因：${error}`);
      return false;
    }
  };

  const columns: ListValueDisplayTableColumns[] = [
    {
      dataIndex: 'id',
      title: <FormattedMessage id="pages.redisDataManage.row" defaultMessage="Row" />,
      width: '30%',
      render: (dom, record) => {
        return record.index + 1;
      }
    },
    {
      dataIndex: 'value',
      title: <FormattedMessage id="pages.redisDataManage.value" defaultMessage="Value" />,
      width: '40%'
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (dom, record) => [
        <a
          key="update"
          onClick={() => {
            setCurrentListRow(record);
            form.setFieldsValue(record);
            setListRowModalType(ListRowModalType.Update)
            handleListAddRowModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.redisConnectionManage.update" defaultMessage="修改" />
        </a>,
        <a
          key="config"
          onClick={() => {
            confirm({
              title: '删除确认',
              icon: <ExclamationCircleOutlined />,
              content: '此操作不可恢复，是否继续 ？',
              onOk() {
                const { value } = record;
                const { connectionId, databaseId } = currentTreeNode;
                handleRemoveRedisValue({ connectionId, databaseId, key: currentRedisKey, value })
              },
              onCancel() {
              },
            });
          }}
        >
          <FormattedMessage id="pages.redisConnectionManage.delete" defaultMessage="删除" />
        </a>
      ],
    },
  ];

  return (
    <div style={{ height: '100%', textAlign: 'right' }}>
      <ProTable
        rowKey="index"
        actionRef={actionRef}
        search={false}
        toolbar={{
          search: {
            onSearch: (value: string) => {
              alert(value);
            },
          },
          actions: [
            <Button
              key="key"
              type="primary"
              onClick={() => {
                setListRowModalType(ListRowModalType.Create)
                handleListAddRowModalVisible(true)
              }}
            >
              添加
            </Button>,
          ]
        }}
        request={(params, sorter, filter) => {
          const { connectionId, databaseId } = currentTreeNode;
          return queryRedisValue({ connectionId, databaseId, key: currentRedisKey, type: 'list', ...params }).then((response) => {
            if (response && response.success) {
              return response.result.value;
            }
            message.error(response.message)
          })
        }}
        pagination={{
          defaultCurrent: 1, pageSize: 10
        }}
        columns={columns}
      />

      <Modal
        title={formatMessage({
          id: 'pages.redisDataManage.list.addRow',
          defaultMessage: '添加行'
        })}
        width="600px"
        destroyOnClose
        visible={listAddRowModalVisible}
        footer={[
          <Button key="cancel" onClick={() => {
            form.resetFields();
            setListRowModalType(ListRowModalType.Create)
            handleListAddRowModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            form
              .validateFields()
              .then((values) => {
                const { connectionId, databaseId } = currentTreeNode;
                const { value } = values;
                if (listRowModalType === ListRowModalType.Create) {
                  handleAddRedisValue({ connectionId, databaseId, key: currentRedisKey, rowValue: value });
                } else if (listRowModalType === ListRowModalType.Update) {
                  const { index } = currentListRow;
                  handleUpdateRedisValue({ connectionId, databaseId, key: currentRedisKey, index, newRowValue: value });
                }
                form.resetFields();
                handleListAddRowModalVisible(false)
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
          handleListAddRowModalVisible(false);
        }}
      >
        <Form
          {...layout}
          layout="horizontal"
          form={form}
          name="redisKeyRenameForm"
        >
          <Form.Item
            name="value"
            label="Value"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisDataManage.value"
                    defaultMessage="Value为必填项"
                  />
                ),
              },
            ]}
          >
            <TextArea placeholder='请输入' />
          </Form.Item >
        </Form>
      </Modal>
    </div>
  );
};

export default ListValueDisplayArea;
