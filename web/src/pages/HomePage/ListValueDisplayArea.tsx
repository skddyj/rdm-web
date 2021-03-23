import React, { useEffect, useState } from 'react';
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

export type ListValueDisplayAreaProps = {
  form;
  currentRedisKey;
  currentTreeNode;
  currentRedisResult;
};

const ListValueDisplayArea: React.FC<ListValueDisplayAreaProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const [currentRow, setCurrentRow] = useState();

  const [dataSource, setDataSource] = useState([]);


  const {
    form,
    currentRedisKey,
    currentTreeNode,
    currentRedisResult
  } = props;

  /** 初始化树数据 */
  useEffect(() => {
    const dataSource = currentRedisResult.value.map((e, index) => {
      return {
        id: index,
        value: e
      }
    })
    setDataSource(dataSource)
  }, [currentRedisResult]);

  const columns: ListValueDisplayTableColumns[] = [
    {
      dataIndex: 'id',
      title: <FormattedMessage id="pages.redisDataManage.row" defaultMessage="Row" />,
      width: '30%'
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
          key="config"
          onClick={() => {
            setCurrentRow(record);
            //form.setFieldsValue(record);
            //setModalType(ModalType.Update)
            //handleModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.redisConnectionManage.update" defaultMessage="修改" />
        </a>,
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            //form.setFieldsValue(record);
            //setModalType(ModalType.Update)
            //handleModalVisible(true);
          }}
        >
          <FormattedMessage id="pages.redisConnectionManage.update" defaultMessage="删除" />
        </a>
      ],
    },
  ];

  return (
    <div style={{ height: '80%', textAlign: 'right' }}>
      <ProTable
        rowKey="id"
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
                alert('add');
              }}
            >
              添加
            </Button>,
          ],
        }}
        dataSource={dataSource}
        // pagination={{
        //   defaultCurrent: 1, pageSize: 10
        // }}
        columns={columns}
      />
    </div>
  );
};

export default ListValueDisplayArea;
