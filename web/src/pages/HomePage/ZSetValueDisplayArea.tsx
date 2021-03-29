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

export type ZSetValueDisplayAreaProps = {
  currentTreeNode;
};



const ZSetValueDisplayArea: React.FC<ZSetValueDisplayAreaProps> = (props) => {
  const {
    currentTreeNode,
  } = props;

  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const actionRef = useRef<ActionType>();

  const [currentListRow, setCurrentListRow] = useState();

  const [listRowModalType, setListRowModalType] = useState<ListRowModalType>(ListRowModalType.Create);

  const [listAddRowModalVisible, handleListAddRowModalVisible] = useState(false);

  useEffect(() => {
    console.log("useEffect")
    if (actionRef.current) {
      actionRef.current.reload();
    }
  });

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
        console.log(fields)
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
        console.log(fields)
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
      width: '20%',
      render: (dom, record) => {
        return record.index + 1;
      }
    },
    {
      dataIndex: 'value',
      title: <FormattedMessage id="pages.redisDataManage.value" defaultMessage="Value" />,
      width: '30%'
    },
    {
      dataIndex: 'score',
      title: <FormattedMessage id="pages.redisDataManage.score" defaultMessage="Score" />,
      width: '30%'
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
                const { connectionId, databaseId, redisKey } = currentTreeNode;
                handleRemoveRedisValue({ connectionId, databaseId, key: redisKey, rowValue: { value } })
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
          console.log('params', params)
          const { connectionId, databaseId, redisKey } = currentTreeNode;
          return queryRedisValue({ connectionId, databaseId, key: redisKey, type: 'zset', ...params }).then((response) => {
            if (response && response.success) {
              console.log(response.result)
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
                console.log(values)
                const { connectionId, databaseId, redisKey } = currentTreeNode;
                if (listRowModalType === ListRowModalType.Create) {
                  handleAddRedisValue({ connectionId, databaseId, key: redisKey, rowValue: values });
                } else if (listRowModalType === ListRowModalType.Update) {
                  const { value: oldValue, index } = currentListRow;
                  handleUpdateRedisValue({ connectionId, databaseId, key: redisKey, index, rowValue: { value: oldValue }, newRowValue: values });
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
          <Form.Item
            name="score"
            label="Score"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisDataManage.score"
                    defaultMessage="分值为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入分值' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ZSetValueDisplayArea;