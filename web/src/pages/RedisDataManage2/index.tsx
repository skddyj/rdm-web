import { PlusOutlined, SoundTwoTone } from '@ant-design/icons';
import { Select, Divider, Modal, Card, Button, message, Input, Drawer, Row, Col, Form, InputNumber } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProCard from "@ant-design/pro-card";
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { RedisConnectionParams, TableListItem } from './data.d';
import { queryAllRedisConnection, queryDatabaseCount, queryDatabaseKeys, updateRedisConnection, addRedisConnection, removeRedisConnection, testRedisConnection } from './service';

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

const getAllRedisConnection = async () => {
  try {
    return await queryAllRedisConnection().then((response) => {
      if (response && response.success) {
        return response.result.map((e) => { return { label: e.name, value: e.id } })
      }
    });
  } catch (error) {
    message.error('查询Redis连接失败');
    return [];
  }
};

const getDatabaseCount = async (id) => {
  try {
    return await queryDatabaseCount(id).then((response) => {
      if (response && response.success) {
        return response.result;
      }
    });
  } catch (error) {
    message.error('查询数据库数量失败');
    return 0;
  }
};

const TableList: React.FC = (props) => {
  // form
  const [form] = Form.useForm();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.Create);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /** 所有redis连接数据*/
  const [redisConnectionData, setRedisConnectionData] = useState<[]>([]);
  /** 所有redis连接数据*/
  const [databaseData, setDatabaseData] = useState([]);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  /** 国际化配置 */
  const intl = useIntl();

  useEffect(() => {
    getAllRedisConnection().then((data) => {
      setRedisConnectionData(data)
    })
  }, []);

  const onRedisConnectionChange = (e) => {
    setDatabaseData([]);
    getDatabaseCount(e).then((count) => {
      const databaseData = Array.from({ length: count }, (k, v) => { return { label: `database ${v}`, value: v } })
      console.log("count", count)
      setDatabaseData(databaseData);
    })
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      dataIndex: 'redisConnectionId',
      title: <FormattedMessage id="pages.redisDataManage.redisConnectionId" defaultMessage="Redis连接" />,
      valueType: 'select',
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        return (
          <Select placeholder='请选择' options={redisConnectionData} />
        );
      },
      fieldProps: {
        onChange: onRedisConnectionChange
      },
      hideInTable: true
    },
    {
      dataIndex: 'databaseId',
      title: <FormattedMessage id="pages.redisDataManage.databaseId" defaultMessage="Redis数据库" />,
      valueType: 'select',
      fieldProps: {
        options: databaseData,
      },
      hideInTable: true
    },
    {
      dataIndex: 'key',
      title: <FormattedMessage id="pages.redisDataManage.key" defaultMessage="Key" />,
      width: '35%'
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
        // <a
        //   key="show"
        //   onClick={() => {
        //     setCurrentRow(record);
        //     form.setFieldsValue(record);
        //     setModalType(ModalType.Update)
        //     setShowDetail(false)
        //     handleModalVisible(true);
        //   }}>
        //   <FormattedMessage id="pages.searchTable.subscribeAlert" defaultMessage="查看" />
        // </a>,
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
      {/* <ProCard split="vertical">
      <ProCard title="左侧详情" colSpan="30%">
        左侧内容
      </ProCard>
      <ProCard title="左右分栏子卡片带标题" headerBordered>
        <div style={{ height: 360 }}>右侧内容</div>
      </ProCard>
    </ProCard> */}
    </PageContainer >
  );
};

export default TableList;
