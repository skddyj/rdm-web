import React, { useEffect, useState, useRef } from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Spin, Input, List, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb } from 'antd';
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
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { queryRedisKeys, addRedisValue } from './service'
import { ModalType } from './HashValueDisplayArea';
import listItemStyle from './List.less';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';

const { TextArea, Search } = Input;
const { confirm } = Modal;


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export enum ListRowModalType { Create, Update };

export type VirtualizedListProps = {
  aaa;
};

const VirtualizedList: React.FC<VirtualizedListProps> = (props) => {
  const {
    aaa,
  } = props;

  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const actionRef = useRef<ActionType>();

  const [loading, setLoading] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {

  }, []);

  const loadedRowsMap = {};

  const getRedisKeys = async (connectionId, databaseId) => {
    try {
      return await queryRedisKeys({ connectionId, databaseId }).then((response) => {
        if (response && response.success) {
          return response.result;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      message.error('查询Keys失败');
    }
  };

  const handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    setLoading(true)
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      loadedRowsMap[i] = 1;
    }
    if (dataSource.length > 300) {
      message.warning('Virtualized List loaded all');
      setLoading(false)
      return;
    }
    getRedisKeys(3472414795677696, 8).then((redisKeys) => {
      setDataSource((origin) => origin.concat(redisKeys))
      setLoading(false)
    })
  };

  const isRowLoaded = ({ index }) => !!loadedRowsMap[index];

  const renderItem = ({ index, key, style }) => {
    const item = dataSource[index];
    return (
      <List.Item
        className={listItemStyle.item}
        onClick={() => onListItemClick(item)}>
        <span style={{ padding: '0 4px' }}
          className={listItemStyle.list_item}>
          <span style={{ display: 'inline-block', textAlign: 'center', width: 24 }}>
            <FileTextOutlined />
          </span>
          {item}
        </span>
      </List.Item>
    );
  };


  const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
    <VList
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onChildScroll}
      overscanRowCount={2}
      rowCount={dataSource.length}
      rowHeight={73}
      rowRenderer={renderItem}
      onRowsRendered={onRowsRendered}
      scrollTop={scrollTop}
      width={width}
    />
  );
  const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
    <AutoSizer disableHeight>
      {({ width }) =>
        vlist({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered,
          width,
        })
      }
    </AutoSizer>
  );

  // 无限下拉
  const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={handleInfiniteOnLoad}
      rowCount={dataSource.length}
    >
      {({ onRowsRendered }) =>
        autoSize({
          height,
          isScrolling,
          onChildScroll,
          scrollTop,
          onRowsRendered,
        })
      }
    </InfiniteLoader>
  );


  return (
    <List>
      {dataSource.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
      {loading && <Spin />}
    </List>
  );
};

export default VirtualizedList;
