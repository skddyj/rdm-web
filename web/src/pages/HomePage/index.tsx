import type {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { Scrollbars } from 'react-custom-scrollbars';
import ScrollView from 'react-custom-scrollbars';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { Dispatch } from 'umi';
import { Link, useIntl, connect, history, FormattedMessage } from 'umi';
import { GithubOutlined, SoundTwoTone } from '@ant-design/icons';
import { Result, Button, Divider, Layout, Menu, Tree, message, Spin, Card, Input, Form, Modal, Typography, Popover, Tooltip, Space, Breadcrumb, List, Empty } from 'antd';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import ProCard from "@ant-design/pro-card";
import logo from '../assets/logo.svg';
import Immutable from 'immutable';

import { LoadingOutlined } from '@ant-design/icons';
const spinIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;


const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

import {
  FileAddFilled,
  CarryOutOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  KeyOutlined,
  SyncOutlined,
  BookOutlined,
  BulbOutlined,
  FileTextOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  queryAllRedisConnection, queryDatabase, queryRedisKeys,
  queryRedisValue, updateRedisConnection, addRedisConnection,
  removeRedisConnection, testRedisConnection,
  queryDatabaseSize, addRedisKey, removeRedisKey, renameRedisKeyValue,
  expireRedisKeyValue
} from './service';

import RedisConnectionModal from './RedisConnectionModal';
import RedisDataModal from './RedisDataModal';
import OperationToolBar from './OperationToolBar';
import ValueDisplayCard from './ValueDisplayCard';
import InfiniteScrollList from './InfiniteScrollList';
import PathArea from './PathArea';

const { TextArea, Search } = Input;
const { DirectoryTree } = Tree;
const { confirm } = Modal;


enum ModalType { Create, Update };

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
} & ProLayoutProps;


const HomePage: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;

  const homeRef = useRef();

  const form = Form.useForm()[0];
  const textAreaForm = Form.useForm()[0];
  const { formatMessage } = useIntl();

  /** 所有Redis连接数据*/
  const [redisConnectionData, setRedisConnectionData] = useState([]);
  /** 展开的树节点Key*/
  const [expandedKeys, setExpandedKeys] = useState<[]>([]);
  /** 选中的树节点Key*/
  const [selectedKeys, setSelectedKeys] = useState<[]>([]);
  /** Redis连接弹窗 */
  const [connectionModalVisible, handleConnectionModalVisible] = useState<boolean>(false);
  /** RedisData弹窗 */
  const [dataModalVisible, handleDataModalVisible] = useState<boolean>(false);
  /** Redis连接弹窗类型 */
  const [connectionModalType, setConnectionModalType] = useState<ModalType>(ModalType.Create);
  /** 当前选择的树节点数据*/
  const [currentTreeNode, setCurrentTreeNode] = useState();
  /** 树加载 */
  const [loadingTree, handleLoadingTree] = useState<boolean>(true);
  /** 树加载 */
  const [refreshRedisKeys, handleRefreshRedisKeys] = useState<boolean>(false);

  /** 当前选中的Redis Key*/
  const [currentRedisKey, setCurrentRedisKey] = useState();

  /** 初始化树数据 */
  useEffect(() => {
    getAllRedisConnection().then((data) => {
      handleLoadingTree(false)
      setRedisConnectionData(data)
    })
  }, []);

  /**
   * 添加Redis连接
   */
  const handleAddRedisConnection = async (fields) => {
    const hide = message.loading('正在添加');
    try {
      return await addRedisConnection({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('添加成功');
          // 更新state
          refreshRedisConnection();
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`添加111失败，请重试，失败原因：${error}`);
      return false;
    }
  };

  /**
   * 修改Redis连接
   */
  const handleUpdateRedisConnection = async (fields) => {
    const hide = message.loading('正在修改');
    try {
      return await updateRedisConnection({
        ...fields
      }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('修改成功');
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
   * 删除Redis连接
   */
  const handleRemoveRedisConnection = async (currentTreeNode) => {
    const hide = message.loading('正在删除');
    if (!currentTreeNode) return false;
    try {
      return await removeRedisConnection(currentTreeNode.connectionId).then((response) => {
        if (response && response.success) {
          hide();
          message.success('删除成功');
          // 更新state
          clearSelected()
          refreshRedisConnection();
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

  /**
   * 测试Redis连接
   */
  const handleTestRedisConnection = async (fields) => {
    const hide = message.loading('正在测试连接');
    try {
      return await testRedisConnection(fields).then((response) => {
        if (response && response.success) {
          hide();
          message.success('连接成功');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error('连接失败，请检查配置');
      return false;
    }
  };

  /** 
   * 获取所有Redis连接
   */
  const getAllRedisConnection = async () => {
    try {
      return await queryAllRedisConnection().then((response) => {
        if (response && response.success) {
          return response.result.map((e) => {
            return {
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, connectionName: e.name, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
            }
          })
        }
      });
    } catch (error) {
      message.error('查询Redis连接失败');
      return [];
    }
  };

  /** 
   * 加载所有Redis连接
   */
  const loadAllRedisConnection = async () => {
    handleLoadingTree(true);
    try {
      return await queryAllRedisConnection().then((response) => {
        if (response && response.success) {
          const data = response.result.map((e) => {
            return {
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, connectionName: e.name, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
            }
          });
          handleLoadingTree(false)
          setRedisConnectionData(data);
        }else{
          handleLoadingTree(false)
        }
      });
    } catch (error) {
      handleLoadingTree(false)
      message.error('查询Redis连接失败');
      return [];
    }
  };

  /**
   * 添加Redis Key
   */
  const handleAddRedisKey = async (fields) => {
    const hide = message.loading('正在添加');
    try {
      return await addRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('添加成功');
          refreshCurrentDatabase();
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
   * 删除Redis Key
   */
  const handleRemoveRedisKey = async (fields) => {
    const hide = message.loading('正在删除');
    try {
      return await removeRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('删除成功');
          refreshCurrentDatabase(currentTreeNode);
          setCurrentRedisKey(undefined)
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

  /**
   * 重命名Redis Key
   */
  const handleRenameRedisKey = async (fields) => {
    const hide = message.loading('正在重命名');
    try {
      return await renameRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('重命名成功');
          refreshCurrentDatabase();
          setCurrentRedisKey(undefined)
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`重命名失败，请重试，失败原因：${error}`);
      return false;
    }
  };


  /**
   * Redis Key设置ttl
   */
  const handleExpireRedisKey = async (fields) => {
    const hide = message.loading('正在更新TTL');
    try {
      return await expireRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('更新TTL成功');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      refreshCurrentDatabase();
      message.error(`更新TTL失败，请重试，失败原因：${error}`);
      return false;
    }
  };


  /**
   * 获取Redis数据库
   */
  const getRedisDatabase = async (id) => {
    try {
      return await queryDatabase(id).then((response) => {
        if (response && response.success) {
          return response.result;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      message.error('查询数据库数量失败');
    }
  };

  const refreshRedisConnection = () => {
    handleLoadingTree(true);
    let newRedisConnectionData = [...redisConnectionData];
    getAllRedisConnection().then((data) => {
      // 遍历后端数据
      data.forEach((rowData) => {
        // 比较当前树数据和数据库数据
        const flag = redisConnectionData.findIndex((item) => item.connectionId === rowData.connectionId)
        if (flag === -1) { // 说明后端新增数据
          newRedisConnectionData = [...newRedisConnectionData, rowData]
        }
      });
      // 遍历前端数据
      let expandKey = [];
      redisConnectionData.forEach((rowData) => {
        // 比较当前树数据和数据库数据
        const flag = data.findIndex((item) => item.connectionId === rowData.connectionId)
        if (flag === -1) { // 说明后端已删除的数据
          expandKey = [...expandKey, rowData.key]
          newRedisConnectionData.splice(newRedisConnectionData.findIndex(row => row.connectionId === rowData.connectionId), 1)
        }
      });
      handleLoadingTree(false);
      setRedisConnectionData([...newRedisConnectionData])
      expandKey.forEach((key) => {
        onTreeNodeFold(key, true)
      });

    });
  }

  /** 
   * 清空选中 
   */
  const clearSelected = () => {
    setSelectedKeys([]);
    setCurrentTreeNode(undefined);
    setCurrentRedisKey(undefined)
  }

  /** 
   * 关闭所有展开
   */
  const clearExpanded = () => {
    setExpandedKeys([])
  }

  /** 
   * 更新树数据 
   * 
   */
  const updateRedisConnectionData = (list, key, children: []) => {
    return list.map(node => {
      if (node.key === key) {
        return {
          ...node,
          switcherIcon: undefined,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateRedisConnectionData(node.children, key, children),
        };
      }
      return node;
    });
  }

  // /**
  //  * 异步加载树数据
  //  */
  // const onLoadData = ({ key, title, children, level, connectionId, connectionName, databaseId, connectionKey }) => {
  //   return new Promise<void>(resolve => {
  //     if (children && children.length > 0) {
  //       resolve();
  //       return;
  //     }
  //     getRedisDatabase(connectionId).then((databases) => {
  //       const databaseData = databases.map((database) => {
  //         return buildDatabaseTreeNode(database, connectionKey, connectionId, connectionName);
  //       })
  //       setRedisConnectionData(origin =>
  //         updateRedisConnectionData(origin, connectionKey, databaseData),
  //       );
  //       resolve();
  //     })
  //   });
  // }

  /**
   * 树节点选择
   */
  const onTreeNodeSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    setSelectedKeys(selectedKeys);
    if (selected) {
      setCurrentTreeNode(node);
    } else {
      setCurrentTreeNode(undefined)
    }
  }


  /**
   * 树节点展开
   */
  const onTreeNodeExpand = (expandedKeys, { expanded: bool, node }) => {
    const { children, connectionId, connectionName, connectionKey } = node;
    if (bool) {
      if (children && children.length > 0) {
        setExpandedKeys(expandedKeys);
        return;
      }
      handleLoadingTreeNode(node.key);
      getRedisDatabase(connectionId).then((databases) => {
        const databaseData = databases.map((database) => {
          return buildDatabaseTreeNode(database, connectionKey, connectionId, connectionName);
        })
        setRedisConnectionData(origin =>
          updateRedisConnectionData(origin, connectionKey, databaseData),
        );
        setExpandedKeys(expandedKeys);
      })
    } else {
      setExpandedKeys(expandedKeys);
    }
  };

  /**
   * 加载树节点
   */
  const handleLoadingTreeNode = (key) => {
    setRedisConnectionData(origin => {
      const newData = Immutable.fromJS(origin).toJS();
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].key === key) {
          newData[i].children = [];
          newData[i].switcherIcon = <Spin indicator={spinIcon} />;
        }
      }
      return newData;
    });
  }


  /**
   * 构造database树节点
   */
  const buildDatabaseTreeNode = (database, connectionKey, connectionId, connectionName) => {
    return {
      title: buildDatabaseTitle(database.name, database.keysCount), key: `${connectionKey}-${database.id}`, keysCount: database.keysCount, connectionKey, databaseKey: `${connectionKey}-${database.id}`, level: 2, connectionId, connectionName, databaseId: database.id, databaseName: database.name, isLeaf: true, icon: < DatabaseOutlined />
    }
  }

  const buildDatabaseTitle = (name, keysCount) => {
    return `${name} (${keysCount})`;
  }

  /**
   * 树节点折叠
   */
  const onTreeNodeFold = (key, includeChildren) => {
    if (includeChildren) {
      const newExpandedKeys = [...expandedKeys].filter(e => !e.startsWith(key));
      setExpandedKeys(newExpandedKeys)
    } else {
      const newExpandedKeys = [...expandedKeys].filter(e => e !== key);
      setExpandedKeys(newExpandedKeys)
    }
  }

  /**
   * 刷新当前Database的key
   */
  const refreshCurrentDatabase = () => {
    refreshDatabase(currentTreeNode);
  }

  /**
   * 刷新Database的key
   */
  const refreshDatabase = (treeNode) => {
    const { connectionId, databaseId } = treeNode;
    homeRef.current.refreshRedisKeys();
    queryDatabaseSize({ connectionId, databaseId }).then((response) => {
      if (response && response.success) {
        console.log(response)
        const { result } = response;
        const newData = Immutable.fromJS(redisConnectionData).toJS();
        newData.map((connection) => {
          if (connection.connectionId === connectionId) {
            connection.children.map((database) => {
              if (database.databaseId === databaseId) {
                database.title = buildDatabaseTitle(database.databaseName, result);
                database.keysCount = result;
              }
            })
          }
        });
        setRedisConnectionData(newData);
      }
    })
  }

  /**
   * 刷新当前连接的Database
   */
  const refreshCurrentConnection = () => {
    refreshConnection(currentTreeNode);
  }

  /**
   * 刷新连接的Database
   */
  const refreshConnection = (node) => {
    const { connectionId, connectionKey, connectionName } = node;
    handleLoadingTreeNode(node.key);
    getRedisDatabase(connectionId).then((databases) => {
      const databaseData = databases.map((database) => {
        return buildDatabaseTreeNode(database, connectionKey, connectionId, connectionName);
      })
      setRedisConnectionData(origin =>
        updateRedisConnectionData(origin, connectionKey, databaseData),
      );
    })
  }

  const empty = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ width: '100%', height: '100%', marginTop: '60px', padding: '16px' }} />;

  return (
    <Layout style={{ height: '100%' }}>
      <Sider
        style={{ background: '#f0f2f5' }}
        width="30%"
      >
        <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }}>
          <Button
            icon={<FileAddFilled />}
            type="primary"
            block
            onClick={() => {
              setConnectionModalType(ModalType.Create)
              handleConnectionModalVisible(true);
            }}>
            添加Redis连接
          </Button>
          <div style={{ width: 'calc(50% - 2px)', float: 'left', height: 'calc(100% - 96px)' }}>
            <OperationToolBar
              form={form}
              currentTreeNode={currentTreeNode}
              onTreeNodeFold={onTreeNodeFold}
              setConnectionModalType={setConnectionModalType}
              handleConnectionModalVisible={handleConnectionModalVisible}
              handleDataModalVisible={handleDataModalVisible}
              handleRemoveRedisConnection={handleRemoveRedisConnection}
              refreshCurrentConnection={refreshCurrentConnection}
              refreshCurrentDatabase={refreshCurrentDatabase}
              clearExpanded={clearExpanded}
              clearSelected={clearSelected}
              expandedKeys={expandedKeys}
              loadAllRedisConnection={loadAllRedisConnection}
            />
            <Scrollbars
              autoHide
              style={{
                marginTop: 20, height: '100%'
              }}>
              {loadingTree ?
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Spin />
                </div> :
                redisConnectionData && redisConnectionData.length > 0 ?
                  <Tree
                    showIcon
                    //loadData={onLoadData}
                    switcherIcon={< CaretDownOutlined />}
                    onExpand={onTreeNodeExpand}
                    onSelect={onTreeNodeSelect}
                    selectedKeys={selectedKeys}
                    expandedKeys={expandedKeys}
                    treeData={redisConnectionData}
                  /> : empty}
            </Scrollbars>
          </div>
          <Divider type='vertical' style={{ height: 'calc(100% - 92px)', float: 'left', margin: '72px 0 0 0' }} />
          <InfiniteScrollList
            currentTreeNode={currentTreeNode}
            refreshRedisKeys={refreshRedisKeys}
            ref={homeRef}
            handleRefreshRedisKeys={handleRefreshRedisKeys}
            setCurrentRedisKey={setCurrentRedisKey}
          />
        </Card>
      </Sider>
      <Layout>
        <Card style={{ height: '52px' }} bordered={false}>
          <PathArea
            currentTreeNode={currentTreeNode}
            currentRedisKey={currentRedisKey}
          />
        </Card>
        <Content style={{ height: 'calc(100% - 128px)' }}>
          <ValueDisplayCard
            form={textAreaForm}
            currentTreeNode={currentTreeNode}
            currentRedisKey={currentRedisKey}
            handleRemoveRedisKey={handleRemoveRedisKey}
            handleRenameRedisKey={handleRenameRedisKey}
            handleExpireRedisKey={handleExpireRedisKey}
          />
        </Content>
        <Card style={{ height: '76px', textAlign: 'center' }}>
          Developed by Dongyanjun ©2021
          </Card>
      </Layout>
      <RedisConnectionModal
        form={form}
        currentTreeNode={currentTreeNode}
        connectionModalType={connectionModalType}
        connectionModalVisible={connectionModalVisible}
        handleAddRedisConnection={handleAddRedisConnection}
        handleUpdateRedisConnection={handleUpdateRedisConnection}
        handleTestRedisConnection={handleTestRedisConnection}
        loadAllRedisConnection={loadAllRedisConnection}
        clearSelected={clearSelected}
        handleConnectionModalVisible={handleConnectionModalVisible}
      />
      <RedisDataModal
        form={form}
        currentTreeNode={currentTreeNode}
        dataModalVisible={dataModalVisible}
        handleAddRedisData={handleAddRedisKey}
        handleDataModalVisible={handleDataModalVisible}
        refreshCurrentDatabase={refreshCurrentDatabase}
      />
    </Layout >
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(HomePage);
