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
import { Scrollbars } from 'react-custom-scrollbars';
import {
  EditOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  SyncOutlined,
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

export type HashValueDisplayAreaProps = {
  currentTreeNode;
  currentRedisKey;
};



const HashValueDisplayArea: React.FC<HashValueDisplayAreaProps> = (props) => {
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
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await addRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.addedSucceed.content" }));
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.addedFailed" }) + error);
      return false;
    }
  };

  /**
 * 修改Redis Value
 */
  const handleUpdateRedisValue = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await updateRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.editSucceed.content" }));
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.editFailed.content" }) + error);
      return false;
    }
  };

  /**
 * 修改Redis Value
 */
  const handleRemoveRedisValue = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await removeRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.deleteSucceed.content" }));
          if (actionRef.current) {
            actionRef.current.reload();
          }
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.deleteFailed.content" }) + error);
      return false;
    }
  };

  const columns: ListValueDisplayTableColumns[] = [
    {
      dataIndex: 'id',
      title: <FormattedMessage id="list.column.id" />,
      width: '20%',
      render: (dom, record) => {
        return record.index + 1;
      }
    },
    {
      dataIndex: 'field',
      title: <FormattedMessage id="list.column.field" />,
      width: '30%'
    },
    {
      dataIndex: 'value',
      title: <FormattedMessage id="list.column.value" />,
      width: '30%'
    },
    {
      title: <FormattedMessage id="list.column.operation" />,
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
          <FormattedMessage id="button.common.edit" />
        </a>,
        <a
          key="config"
          onClick={() => {
            confirm({
              title: formatMessage({ "id": "modal.redis.connection.delete.confirm.title" }),
              icon: <ExclamationCircleOutlined />,
              content: formatMessage({ "id": "modal.redis.connection.delete.confirm.content" }),
              onOk() {
                const { field } = record;
                const { connectionId, databaseId } = currentTreeNode;
                handleRemoveRedisValue({ connectionId, databaseId, key: currentRedisKey, rowValue: { field } })
              },
              onCancel() {
              },
            });
          }}
        >
          <FormattedMessage id="button.common.delete" />
        </a>
      ],
    },
  ];

  return (
    <div style={{ height: '100%', textAlign: 'right' }}>
      <Scrollbars
        autoHide
        style={{
          height: '100%'
        }}>
        <ProTable
          rowKey="index"
          size="small"
          actionRef={actionRef}
          search={false}
          options={{
            density: false, setting: { draggable: true, checkable: true }
          }}
          toolbar={{
            actions: [
              <Button
                key="key"
                type="primary"
                icon={<FileAddOutlined />}
                onClick={() => {
                  setListRowModalType(ListRowModalType.Create)
                  handleListAddRowModalVisible(true)
                }}
              >
                {formatMessage({ "id": "button.common.new" })}
              </Button>,
            ]
          }}
          request={(params, sorter, filter) => {
            if (currentRedisKey) {
              const { connectionId, databaseId } = currentTreeNode;
              return queryRedisValue({ connectionId, databaseId, key: currentRedisKey, type: 'zset', ...params }).then((response) => {
                if (response && response.success) {
                  return response.result.value;
                }
                message.error(response.message)
              })
            }
          }}
          pagination={{
            defaultCurrent: 1, pageSize: 10
          }}
          columns={columns}
        />
      </Scrollbars>
      <Modal
        title={formatMessage({
          id: formatMessage({ "id": listRowModalType === ListRowModalType.Create ? 'modal.redis.list.addRow.title' : 'modal.redis.list.editRow.title' })
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
            {formatMessage({ "id": "button.common.cancel" })}
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            form
              .validateFields()
              .then((values) => {
                const { connectionId, databaseId } = currentTreeNode;
                if (listRowModalType === ListRowModalType.Create) {
                  handleAddRedisValue({ connectionId, databaseId, key: currentRedisKey, rowValue: values });
                } else if (listRowModalType === ListRowModalType.Update) {
                  const { field: oldField } = currentListRow;
                  handleUpdateRedisValue({ connectionId, databaseId, key: currentRedisKey, rowValue: { field: oldField }, newRowValue: values });
                }
                form.resetFields();
                handleListAddRowModalVisible(false)
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
            {formatMessage({ "id": "button.common.confirm" })}
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
            name="field"
            label="Field"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="modal.redis.key.new.hash.field.required"
                  />
                ),
              },
            ]}
          >
            <Input placeholder={formatMessage({ "id": "modal.redis.key.new.hash.field.required" })} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Value"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="modal.redis.key.new.value.required"
                  />
                ),
              },
            ]}
          >
            <TextArea placeholder={formatMessage({ "id": "modal.redis.key.new.value.required" })} />
          </Form.Item >

        </Form>
      </Modal>
    </div>
  );
};

export default HashValueDisplayArea;
