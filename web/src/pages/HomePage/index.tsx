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

  /** ??????Redis????????????*/
  const [redisConnectionData, setRedisConnectionData] = useState([]);
  /** ??????????????????Key*/
  const [expandedKeys, setExpandedKeys] = useState<[]>([]);
  /** ??????????????????Key*/
  const [selectedKeys, setSelectedKeys] = useState<[]>([]);
  /** Redis???????????? */
  const [connectionModalVisible, handleConnectionModalVisible] = useState<boolean>(false);
  /** RedisData?????? */
  const [dataModalVisible, handleDataModalVisible] = useState<boolean>(false);
  /** Redis?????????????????? */
  const [connectionModalType, setConnectionModalType] = useState<ModalType>(ModalType.Create);
  /** ??????????????????????????????*/
  const [currentTreeNode, setCurrentTreeNode] = useState();
  /** ????????? */
  const [loadingTree, handleLoadingTree] = useState<boolean>(true);
  /** ????????? */
  const [refreshRedisKeys, handleRefreshRedisKeys] = useState<boolean>(false);

  /** ???????????????Redis Key*/
  const [currentRedisKey, setCurrentRedisKey] = useState();

  /** ?????????????????? */
  useEffect(() => {
    getAllRedisConnection().then((data) => {
      handleLoadingTree(false)
      setRedisConnectionData(data)
    })
  }, []);

  /**
   * ??????Redis??????
   */
  const handleAddRedisConnection = async (fields) => {
    const hide = message.loading('????????????');
    try {
      return await addRedisConnection({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          // ??????state
          refreshRedisConnection();
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`??????111????????????????????????????????????${error}`);
      return false;
    }
  };

  /**
   * ??????Redis??????
   */
  const handleUpdateRedisConnection = async (fields) => {
    const hide = message.loading('????????????');
    try {
      return await updateRedisConnection({
        ...fields
      }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`??????????????????????????????????????????${error}`);
      return false;
    }
  };

  /**
   * ??????Redis??????
   */
  const handleRemoveRedisConnection = async (currentTreeNode) => {
    const hide = message.loading('????????????');
    if (!currentTreeNode) return false;
    try {
      return await removeRedisConnection(currentTreeNode.connectionId).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          // ??????state
          clearSelected()
          refreshRedisConnection();
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`??????????????????????????????????????????${error}`);
      return false;
    }
  };

  /**
   * ??????Redis??????
   */
  const handleTestRedisConnection = async (fields) => {
    const hide = message.loading('??????????????????');
    try {
      return await testRedisConnection(fields).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error('??????????????????????????????');
      return false;
    }
  };

  /** 
   * ????????????Redis??????
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
      message.error('??????Redis????????????');
      return [];
    }
  };

  /** 
   * ????????????Redis??????
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
      message.error('??????Redis????????????');
      return [];
    }
  };

  /**
   * ??????Redis Key
   */
  const handleAddRedisKey = async (fields) => {
    const hide = message.loading('????????????');
    try {
      return await addRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          refreshCurrentDatabase();
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`??????????????????????????????????????????${error}`);
      return false;
    }
  };

  /**
   * ??????Redis Key
   */
  const handleRemoveRedisKey = async (fields) => {
    const hide = message.loading('????????????');
    try {
      return await removeRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('????????????');
          refreshCurrentDatabase();
          setCurrentRedisKey(undefined)
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`??????????????????????????????????????????${error}`);
      return false;
    }
  };

  /**
   * ?????????Redis Key
   */
  const handleRenameRedisKey = async (fields) => {
    const hide = message.loading('???????????????');
    try {
      return await renameRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('???????????????');
          refreshCurrentDatabase();
          setCurrentRedisKey(undefined)
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`?????????????????????????????????????????????${error}`);
      return false;
    }
  };


  /**
   * Redis Key??????ttl
   */
  const handleExpireRedisKey = async (fields) => {
    const hide = message.loading('????????????TTL');
    try {
      return await expireRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success('??????TTL??????');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      refreshCurrentDatabase();
      message.error(`??????TTL????????????????????????????????????${error}`);
      return false;
    }
  };


  /**
   * ??????Redis?????????
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
      message.error('???????????????????????????');
    }
  };

  const refreshRedisConnection = () => {
    handleLoadingTree(true);
    let newRedisConnectionData = [...redisConnectionData];
    getAllRedisConnection().then((data) => {
      // ??????????????????
      data.forEach((rowData) => {
        // ???????????????????????????????????????
        const flag = redisConnectionData.findIndex((item) => item.connectionId === rowData.connectionId)
        if (flag === -1) { // ????????????????????????
          newRedisConnectionData = [...newRedisConnectionData, rowData]
        }
      });
      // ??????????????????
      let expandKey = [];
      redisConnectionData.forEach((rowData) => {
        // ???????????????????????????????????????
        const flag = data.findIndex((item) => item.connectionId === rowData.connectionId)
        if (flag === -1) { // ??????????????????????????????
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
   * ???????????? 
   */
  const clearSelected = () => {
    setSelectedKeys([]);
    setCurrentTreeNode(undefined);
    setCurrentRedisKey(undefined)
  }

  /** 
   * ??????????????????
   */
  const clearExpanded = () => {
    setExpandedKeys([])
  }

  /** 
   * ??????????????? 
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
  //  * ?????????????????????
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
   * ???????????????
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
   * ???????????????
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
   * ???????????????
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
   * ??????database?????????
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
   * ???????????????
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
   * ????????????Database???key
   */
  const refreshCurrentDatabase = () => {
    refreshDatabase(currentTreeNode);
  }

  /**
   * ??????Database???key
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
   * ?????????????????????Database
   */
  const refreshCurrentConnection = () => {
    refreshConnection(currentTreeNode);
  }

  /**
   * ???????????????Database
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
            ??????Redis??????
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
          Developed by Dongyanjun ??2021
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
