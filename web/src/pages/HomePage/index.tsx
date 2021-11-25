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
import { Link, useIntl, connect, setLocale, getLocale } from 'umi';
import { GithubOutlined, SoundTwoTone } from '@ant-design/icons';
import { Dropdown, Button, Divider, Layout, Menu, Tree, message, Spin, Card, Input, Form, Modal, Typography, Row, Col, Space, Breadcrumb, List, Empty } from 'antd';

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
const { Text, Title } = Typography;

import {
  FileAddFilled,
  TranslationOutlined,
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
  queryAllRedisConnection, queryDatabase, updateRedisConnection, addRedisConnection,
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
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await addRedisConnection({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.addedSucceed.content" }));
          // 更新state
          refreshRedisConnection();
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
   * 修改Redis连接
   */
  const handleUpdateRedisConnection = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await updateRedisConnection({
        ...fields
      }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.editSucceed.content" }));
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.editFailed" }) + error);
      return false;
    }
  };

  /**
   * 删除Redis连接
   */
  const handleRemoveRedisConnection = async (currentTreeNode) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    if (!currentTreeNode) return false;
    try {
      return await removeRedisConnection(currentTreeNode.connectionId).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.deleteSucceed.content" }));
          // 更新state
          clearSelected()
          refreshRedisConnection();
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.deleteFailed" }) + error);
      return false;
    }
  };

  /**
   * 测试Redis连接
   */
  const handleTestRedisConnection = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.testing.content" }));
    try {
      return await testRedisConnection(fields).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.connectSucceed.content" }));
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.connectFailed.content" }));
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
      message.error({ "id": "message.redis.connection.queryRedisConnectionFailed.content" });
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
        } else {
          handleLoadingTree(false)
        }
      });
    } catch (error) {
      handleLoadingTree(false)
      message.error(formatMessage({ "id": "message.redis.connection.queryRedisConnectionFailed.content" }));
      return [];
    }
  };

  /**
   * 添加Redis Key
   */
  const handleAddRedisKey = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await addRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.addedSucceed.content" }));
          refreshCurrentDatabase();
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
   * 删除Redis Key
   */
  const handleRemoveRedisKey = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await removeRedisKey({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.deleteSucceed.content" }));
          refreshCurrentDatabase();
          setCurrentRedisKey(undefined)
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

  /**
   * 重命名Redis Key
   */
  const handleRenameRedisKey = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await renameRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.renameSucceed.content" }));
          refreshCurrentDatabase();
          setCurrentRedisKey(undefined)
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.renameFailed.content" }) + error);
      return false;
    }
  };


  /**
   * Redis Key设置ttl
   */
  const handleExpireRedisKey = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.submitting.content" }));
    try {
      return await expireRedisKeyValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.setTtlSucceed.content" }));
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      refreshCurrentDatabase();
      message.error(formatMessage({ "id": "message.redis.connection.setTtlFailed.content" }) + error);
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
      message.error(formatMessage({ "id": "message.redis.connection.queryDatabaseFailed.content" }) + error);
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

  const changLang = (lang) => {
    setLocale(lang);
  };

  const intlMenu = (
    <Menu
      defaultSelectedKeys={getLocale()}
      onClick={({ key }) => {
        changLang(key);
      }}>
      <Menu.Item key="zh-CN" icon={<Text style={{ fontSize: 10, marginRight: 6 }}>CN</Text>}>简体中文</Menu.Item>
      <Menu.Item key="en-US" icon={<Text style={{ fontSize: 10, marginRight: 6 }}>US</Text>}>English</Menu.Item>
    </Menu>
  );

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
            {formatMessage({ "id": "button.redis.connection.new" })}
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
                    titleRender={item =>
                      <span style={{ display: 'inline-block', width: "calc(100% - 24px)" }}>
                        <Text
                          ellipsis style={{ display: 'inline-block', width: "100%" }}>{item.title}
                        </Text>
                      </span>

                    }
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
        <Header style={{ height: '76px', padding: 0 }}>
          <Card style={{ height: '100%', borderRadius: 0 }} bordered={false}>
            <Row style={{ width: "100%" }}>
              <Col span={21}>
                <PathArea
                  currentTreeNode={currentTreeNode}
                  currentRedisKey={currentRedisKey} />
              </Col>
              <Col span={2} offset={1}>
                <Dropdown overlay={intlMenu} placement="bottomCenter">
                  <Button icon={<TranslationOutlined />} style={{ width: "100%" }} type="primary">
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Card>
        </Header>
        <Content style={{ height: 'calc(100% - 92px)' }}>
          <ValueDisplayCard
            form={textAreaForm}
            currentTreeNode={currentTreeNode}
            currentRedisKey={currentRedisKey}
            handleRemoveRedisKey={handleRemoveRedisKey}
            handleRenameRedisKey={handleRenameRedisKey}
            handleExpireRedisKey={handleExpireRedisKey}
          />
        </Content>
        <Footer style={{ height: "40px", padding: "0", textAlign: 'center' }}>
          <Card bordered={false} style={{ height: "100%" }} bodyStyle={{ height: "100%", padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span >Developed by Dongyanjun</span>
            <a href="https://github.com/skddyj/rdm-web" style={{ marginLeft: 20, color: "black", textDecoration: "none" }}>
              <GithubOutlined style={{ fontSize: 16 }}>
              </GithubOutlined>
              <span style={{ marginLeft: 5 }}>GitHub</span>
            </a>
          </Card>
        </Footer>
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
