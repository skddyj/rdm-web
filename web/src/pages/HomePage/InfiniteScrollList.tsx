import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Button, Row, Col, Menu, Tree, message, Select, Card, Input, List, Form, Modal, Typography, Popover, Tooltip, Space, Spin, Empty } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import { Scrollbars } from 'react-custom-scrollbars';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  FileTextOutlined,
  UndoOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  DeleteOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  SoundTwoTone
} from '@ant-design/icons';
import { queryRedisKeys, addRedisValue } from './service'
import { ModalType } from './HashValueDisplayArea';
import listItemStyle from './List.less'
import VirtualizedList from './VirtualizedList'
import InfiniteScroll from 'react-infinite-scroller';
import { values } from 'lodash';

const { Title } = Typography;
const { TextArea, Search } = Input;
const { confirm } = Modal;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export enum ListRowModalType { Create, Update };

export type InfiniteScrollListProps = {
  currentTreeNode;
  setCurrentRedisKey;
  refreshRedisKeys;
  handleRefreshRedisKeys;
};

export type HomeRefProps = {
  refreshRedisKeys();
};

const pageSize = 20;

const getRedisKeys = async (param) => {
  try {
    return await queryRedisKeys({ ...param }).then((response) => {
      if (response && response.success) {
        return response.result;
      }
      throw new Error(response.message);
    });
  } catch (error) {
    message.error('查询Keys失败');
  }
};

const InfiniteScrollList: React.FC<InfiniteScrollListProps> = React.forwardRef<HomeRefProps, InfiniteScrollListProps>((props, homeRef) => {

  const {
    currentTreeNode,
    setCurrentRedisKey,
    refreshRedisKeys,
    handleRefreshRedisKeys
  } = props;

  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const [listRowModalType, setListRowModalType] = useState<ListRowModalType>(ListRowModalType.Create);

  const [listAddRowModalVisible, handleListAddRowModalVisible] = useState(false);

  const [searchValue, setSearchValue] = useState();

  const [key, setKey] = useState();

  const [current, setCurrent] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const [currentListRow, setCurrentListRow] = useState();

  useEffect(() => {
    clearData()
    if (currentTreeNode) {
      handleInitInfiniteOnLoad()
    }
  }, [currentTreeNode]);

  useEffect(() => {
    console.log("key---", key)
    clearData()
    if (currentTreeNode) {
      handleInitInfiniteOnLoad();
    }
  }, [key]);

  useImperativeHandle(homeRef, () => ({
    refreshRedisKeys: () => {
      clearData();
      return handleInitInfiniteOnLoad();
    }
  }));

  const clearData = () => {
    setCurrent(1)
    setDataSource([]);
    setHasMore(true);
    setCurrentListRow(undefined)
    setCurrentRedisKey(undefined)
  }

  const handleInitInfiniteOnLoad = async () => {
    setLoading(true)
    const { connectionId, databaseId } = currentTreeNode;
    let param;
    if (key) {
      param = { connectionId, databaseId, current: 1, pageSize, key };
    } else {
      param = { connectionId, databaseId, current: 1, pageSize };
    }
    return await getRedisKeys(param).then((result) => {
      const { data, hasMore } = result;
      setLoading(false);
      setHasMore(hasMore);
      setCurrent(current => current + 1);
      if (data && data.length > 0) {
        setDataSource(data);
        return data.length;
      }
      return 0;
    })
  };

  const handleInfiniteOnLoad = () => {
    setLoading(true)
    if (!hasMore) {
      message.success('数据已全部加载');
      setLoading(false);
      return;
    }
    const { connectionId, databaseId } = currentTreeNode;
    let param;
    if (key) {
      param = { connectionId, databaseId, current, pageSize, key };
    } else {
      param = { connectionId, databaseId, current, pageSize };
    }
    getRedisKeys(param).then((result) => {
      const { data, hasMore } = result;
      setLoading(false);
      setHasMore(hasMore);
      setCurrent(current => current + 1);
      if (data && data.length > 0) {
        setDataSource((originData) => originData.concat(data))
      }
    })
  };

  const onListItemClick = (item) => {
    if (item === currentListRow) {
      setCurrentListRow(undefined);
      setCurrentRedisKey(undefined)
    } else {
      setCurrentListRow(item);
      setCurrentRedisKey(item);
    }
  }

  const getRowClassName = (item) => {
    if (currentListRow === item) {
      return listItemStyle.list_item_click;
    } else {
      return listItemStyle.list_item;
    }
  }

  const onChange = (e) => {
    setSearchValue(e.target.value)
  }

  const onSearch = (key) => {
    setKey(key);
  }

  const onReset = () => {
    setSearchValue(undefined);
    setKey(undefined);
  }


  return (
    <div style={{ width: 'calc(50% - 2px)', float: 'right', height: 'calc(100% - 72px)', marginLeft: '2px' }}>
      <Row gutter={{ xs: 4, sm: 4, md: 4 }} style={{ marginTop: 20, height: 32 }}>
        <Col span={22} >
          <Search placeholder="请输入" enterButton onChange={onChange} onSearch={onSearch} value={searchValue} />
        </Col>
        <Col span={2} >
          <Button type="primary" icon={<UndoOutlined />} title="重置" onClick={onReset} />
        </Col>
      </Row>
      <Scrollbars
        autoHide
        style={{
          marginTop: 48, height: 'calc(100% - 52px)'
        }}>
        {
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={handleInfiniteOnLoad}
            hasMore={!loading && hasMore}
            useWindow={false}
          >
            <List
              className={listItemStyle.list}
              size="small"
              split={false}
              dataSource={dataSource}
              // rowKey={(item) => item.id}
              renderItem={item => <List.Item className={listItemStyle.item} onClick={() => onListItemClick(item)}><span style={{ padding: '0 4px' }} className={getRowClassName(item)}><span style={{ display: 'inline-block', textAlign: 'center', width: 24 }}><FileTextOutlined /></span>{item}</span></List.Item>}
            />
            {loading && hasMore && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Spin />
              </div>
            )}
          </InfiniteScroll>
        }
      </Scrollbars>
    </div>
  );
})

export default InfiniteScrollList;
