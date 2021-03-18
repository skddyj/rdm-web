import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { Dispatch } from 'umi';
import { Link, useIntl, connect, history, FormattedMessage } from 'umi';
import { GithubOutlined, SoundTwoTone } from '@ant-design/icons';
import { Result, Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import ProCard from "@ant-design/pro-card";
import logo from '../assets/logo.svg';
import DraggleLayout from './DraggleLayout'
const { Header, Content, Footer, Sider } = Layout;
import {
  CaretDownOutlined,
  DatabaseOutlined,
  DownOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { queryAllRedisConnection, queryDatabaseCount, queryDatabaseKeys, updateRedisConnection, addRedisConnection, removeRedisConnection, testRedisConnection } from './service';

const { TextArea } = Input;
const { DirectoryTree } = Tree;

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};
/** Use Authorized check all menu item */

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} Developed By Dongyanjun`}
    links={[
      {
        key: 'Ant Design Pro',
        title: 'Ant Design Pro',
        href: 'https://pro.ant.design',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/ant-design/ant-design-pro',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

const getAllRedisConnection = async () => {
  try {
    return await queryAllRedisConnection().then((response) => {
      if (response && response.success) {
        return response.result.map((e) => { return { title: e.name, key: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, icon: < DatabaseOutlined /> } })
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

const getDatabaseKeys = async (redisConnectionId, databaseId) => {
  try {
    return await queryDatabaseKeys({ redisConnectionId, databaseId }).then((response) => {
      if (response && response.success) {
        console.log(response);
        return response.result;
      }
      message.error(response.message)
    });
  } catch (error) {
    message.error('查询Key失败');
    return 0;
  }
};

const BasicLayout2: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  const [form] = Form.useForm();

  /** 所有redis连接数据*/
  const [redisConnectionData, setRedisConnectionData] = useState<[]>([]);

  /** 所有redis连接数据*/
  const [expandedKeys, setExpandedKeys] = useState<[]>([]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const menuDataRef = useRef<MenuDataItem[]>([]);

  useEffect(() => {
    console.log("222")
    if (dispatch) {
      console.log("111")
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  useEffect(() => {

    getAllRedisConnection().then((data) => {
      setRedisConnectionData(data)
    })
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const updateRedisConnectionData = (list, key, children: []) => {
    console.log("key", key)
    return list.map(node => {
      if (node.key === key) {
        console.log("111")
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        console.log("222")
        return {
          ...node,
          children: updateRedisConnectionData(node.children, key, children),
        };
      }
      return node;
    });
  }

  const onLoadData = ({ key, titlle, children, level, connectionId, databaseId }) => {
    const treeNodeKey = key;
    console.log(treeNodeKey + ':' + level + ':' + connectionId + ':' + databaseId)
    return new Promise<void>(resolve => {
      if (children && children.length > 0) {
        resolve();
        return;
      }
      if (level === 1) {
        console.log("连接展开")
        getDatabaseCount(connectionId).then((databaseCount) => {
          const databaseData = Array.from({ length: databaseCount }, (k, v) => { return { title: `database ${v}`, key: `${treeNodeKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined /> } })
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, databaseData),
          );
          resolve();
        })
      }
      else if (level === 2) {
        console.log("数据库展开")
        const a = getDatabaseKeys(connectionId, databaseId);

        getDatabaseKeys(connectionId, databaseId).then((redisKeys) => {
          console.log("redisKeys", redisKeys)
          const redisKeyData = redisKeys.map((redisKey) => {
            return { title: redisKey, key: `${treeNodeKey}-${redisKey}`, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
          });
          console.log("redisKeyData", redisKeyData.length)
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, redisKeyData),
          );
          resolve();
        })
      }
    });
  }

  // get children authority
  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  const { formatMessage } = useIntl();

  const onExpand = (expandedKeys, { expanded: bool, node }) => {
    //this.onLoadData()
    const { key, titlle, children, level, connectionId, databaseId } = node;
    const treeNodeKey = key;
    if (bool) {
      if (children && children.length > 0) {
        setExpandedKeys(expandedKeys);
        return;
      }
      if (level === 1) {
        console.log("连接展开")
        getDatabaseCount(connectionId).then((databaseCount) => {
          const databaseData = Array.from({ length: databaseCount }, (k, v) => { return { title: `database ${v}`, key: `${treeNodeKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined /> } })
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, databaseData),
          );
          setExpandedKeys(expandedKeys);
        })
      }
      else if (level === 2) {
        console.log("数据库展开")
        getDatabaseKeys(connectionId, databaseId).then((redisKeys) => {
          console.log("redisKeys", redisKeys)
          const redisKeyData = redisKeys.map((redisKey) => {
            return { title: redisKey, key: `${treeNodeKey}-${redisKey}`, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
          });
          console.log("redisKeyData", redisKeyData.length)
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, redisKeyData),
          );
          setExpandedKeys(expandedKeys);
        })
      }
    } else {
      setExpandedKeys(expandedKeys);
    }
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    //setAutoExpandParent(false);
  };

  return (
    // <ProCard split="vertical" bordered style={{ height: '100%' }}>
    //   <ProCard title="左侧详情" colSpan="300px">

    //   </ProCard>
    //   <ProCard title="流量占用情况">
    //     <div style={{ height: 360 }}>右侧内容</div>
    //   </ProCard>
    // </ProCard>
    <Layout>
      <Sider
        style={{ background: '#f0f2f5' }}
        width="25%"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Card style={{ height: '100%' }}>
          <Button type="primary" block>
            添加Redis连接
          </Button>
          <div style={{ marginTop: '30px' }}>
            <Tree
              showLine
              showIcon
              //loadData={onLoadData}
              switcherIcon={<CaretDownOutlined />}
              onExpand={onExpand}
              onSelect={onSelect}
              expandedKeys={expandedKeys}
              treeData={redisConnectionData}
            />
          </div>
        </Card>
        {/* <Divider type='vertical' style={{ height: '100%' }} /> */}
      </Sider>
      <Layout>
        <Card style={{ height: '20%' }}>
          Header
          </Card>
        <Content style={{ height: '80%' }}>
          <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }}>
            <div style={{ height: '10%' }}>
              <Button type="primary">保存</Button>
            </div>
            <TextArea value={'1111'} style={{ height: '90%' }} />
          </Card>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}> */}
        <Card style={{ height: '10%', textAlign: 'center' }}>
          Developed by Dongyanjun ©2021
          </Card>
        {/* </Footer> */}
      </Layout>
    </Layout >
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout2);
