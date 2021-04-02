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
import { Result, Button, Divider, Layout, Menu, Tree, message, Spin, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb } from 'antd';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import ProCard from "@ant-design/pro-card";
import logo from '../assets/logo.svg';
import DraggleLayout from './DraggleLayout'
const { Header, Content, Footer, Sider } = Layout;
import {
  FileAddFilled,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  RedoOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  queryAllRedisConnection, queryDatabaseCount, queryRedisKeys,
  queryRedisValue, updateRedisConnection, addRedisConnection,
  removeRedisConnection, testRedisConnection,
  setKeyValue, addRedisKey, removeRedisKey, renameRedisKeyValue,
  expireRedisKeyValue
} from './service';

import RedisConnectionModal from './RedisConnectionModal';
import RedisDataModal from './RedisDataModal';
import OperationToolBar from './OperationToolBar';
import ValueDisplayCard from './ValueDisplayCard';

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
  /** RedisData弹窗 */
  const [loadingTree, handleLoadingTree] = useState<boolean>(true);

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
          console.log('add', response.result);
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
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
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
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
            }
          });
          handleLoadingTree(false)
          setRedisConnectionData(data);
        }
      });
    } catch (error) {
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
          refreshCurrentDatabaseKeys();
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
          refreshDatabaseKeys(currentTreeNode);
          clearSelected()
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
          console.log(response)
          hide();
          message.success('重命名成功');
          refreshDatabaseKeys(currentTreeNode);
          clearSelected()
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
          console.log(response)
          hide();
          message.success('更新TTL成功');
          handleRefreshRedisValue(currentTreeNode);
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      refreshCurrentDatabaseKeys();
      message.error(`更新TTL失败，请重试，失败原因：${error}`);
      return false;
    }
  };


  /**
   * 获取Redis数据库
   */
  const getRedisDatabaseCount = async (id) => {
    try {
      return await queryDatabaseCount(id).then((response) => {
        if (response && response.success) {
          return response.result;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      message.error('查询数据库数量失败');
    }
  };

  /**
   * 获取Redis数据库下所有Key
   */
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


  /**
   * 更新Redis Key对应Value
   */
  const handleUpdateRedisValue = async (fields) => {
    const hide = message.loading('正在更新');
    try {
      return await setKeyValue(fields).then((response) => {
        if (response && response.success) {
          hide();
          message.success('更新成功');
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(`更新失败，请重试，失败原因：${error}`);
      return false;
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
  }

  /** 
   * 关闭所有展开
   */
  const clearExpanded = () => {
    setExpandedKeys([])
  }

  /** 
   * 更新树数据 
   * */
  const updateRedisConnectionData = (list, key, children: []) => {
    return list.map(node => {
      if (node.key === key) {
        return {
          ...node,
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

  /**
   * 更新Redis Key对应Value
   */
  const onRedisValueUpdate = () => {
    const { connectionId, databaseId, redisKey } = currentTreeNode;
    const { redisValue } = textAreaForm.getFieldsValue();
    handleUpdateRedisValue({ connectionId, databaseId, key: redisKey, value: redisValue })
  };

  /**
   * 异步加载树数据
   */
  // const onLoadData = ({ key, title, children, level, connectionId, databaseId }) => {
  //   const treeNodeKey = key;
  //   return new Promise<void>(resolve => {
  //     console.log('children', children)
  //     if (children && children.length > 0) {
  //       resolve();
  //       return;
  //     }
  //     if (level === 1) {
  //       console.log('展开连接')
  //       getRedisDatabaseCount(connectionId).then((databaseCount) => {
  //         const databaseData = Array.from({ length: databaseCount }, (k, v) => {
  //           return { title: `database ${v}`, key: `${treeNodeKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined /> }
  //         })
  //         setRedisConnectionData(origin =>
  //           updateRedisConnectionData(origin, treeNodeKey, databaseData),
  //         );
  //         resolve();
  //       })
  //     }
  //     else if (level === 2) {
  //       console.log('展开数据库')
  //       getRedisKeys(connectionId, databaseId).then((redisKeys) => {
  //         const redisKeyData = redisKeys.map((redisKey) => {
  //           return { title: redisKey, key: `${treeNodeKey}-${redisKey}`, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
  //         });
  //         setRedisConnectionData(origin =>
  //           updateRedisConnectionData(origin, treeNodeKey, redisKeyData),
  //         );
  //         resolve();
  //       })
  //     }
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
    console.log("expandedKeys", expandedKeys)
    const { key, title, children, level, connectionId, databaseId, connectionKey, databaseKey } = node;
    const treeNodeKey = key;
    if (bool) {
      if (children && children.length > 0) {
        setExpandedKeys(expandedKeys);
        return;
      }
      if (level === 1) {
        getRedisDatabaseCount(connectionId).then((databaseCount) => {
          const databaseData = Array.from({ length: databaseCount }, (k, v) => {
            return {
              title: `database ${v}`, key: `${treeNodeKey}-${v}`, connectionKey, databaseKey: `${treeNodeKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined />
            }
          })
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, databaseData),
          );
          setExpandedKeys(expandedKeys);
        })
      }
      else if (level === 2) {
        getRedisKeys(connectionId, databaseId).then((redisKeys) => {
          const redisKeyData = redisKeys.map((redisKey) => {
            return { title: redisKey, key: `${treeNodeKey}-${redisKey}`, connectionKey, databaseKey, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
          });
          setRedisConnectionData(origin =>
            updateRedisConnectionData(origin, treeNodeKey, redisKeyData),
          );
          setExpandedKeys(expandedKeys);
        })
      }
    } else {
      setExpandedKeys(expandedKeys);
    }
  };

  /**
   * 树节点折叠
   */
  const onTreeNodeFold = (key, includeChildren) => {
    if (includeChildren) {
      const newExpandedKeys = [...expandedKeys].filter(e => !e.startsWith(key));
      console.log("newExpandedKeys", newExpandedKeys)
      setExpandedKeys(newExpandedKeys)
    } else {
      const newExpandedKeys = [...expandedKeys].filter(e => e !== key);
      setExpandedKeys(newExpandedKeys)
    }
  }

  /**
   * 刷新当前Database所有Key
   */
  const refreshCurrentDatabaseKeys = () => {
    refreshDatabaseKeys(currentTreeNode);
  }

  /**
   * 刷新Database所有Key
   */
  const refreshDatabaseKeys = (node) => {
    console.log("refreshDatabaseKeys", node)
    const { key, connectionId, databaseId, connectionKey, databaseKey } = node;
    setRedisConnectionData(origin =>
      updateRedisConnectionData(origin, databaseKey, []),
    );
    getRedisKeys(connectionId, databaseId).then((redisKeys) => {
      const redisKeyData = redisKeys.map((redisKey) => {
        return { title: redisKey, key: `${databaseKey}-${redisKey}`, connectionKey, databaseKey, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
      });
      setRedisConnectionData(origin =>
        updateRedisConnectionData(origin, databaseKey, redisKeyData),
      );
    })
  }

  /**
   * 刷新当前连接的Database
   */
  const refreshCurrentConnectionDatabase = () => {
    refreshConnectionDatabase(currentTreeNode);
  }

  /**
   * 刷新连接的Database
   */
  const refreshConnectionDatabase = (node) => {
    const { key, connectionId, connectionKey } = node;
    setRedisConnectionData(origin =>
      updateRedisConnectionData(origin, connectionKey, []),
    );
    getRedisDatabaseCount(connectionId).then((databaseCount) => {
      const databaseData = Array.from({ length: databaseCount }, (k, v) => {
        return {
          title: `database ${v}`, key: `${connectionKey}-${v}`, connectionKey, databaseKey: `${connectionKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined />
        }
      })
      setRedisConnectionData(origin =>
        updateRedisConnectionData(origin, connectionKey, databaseData),
      );
      // 折叠当前Redis连接所有有database
      const newExpandedKeys = [...expandedKeys].filter(e => e === currentTreeNode.key || !e.startsWith(currentTreeNode.key));
      setExpandedKeys(newExpandedKeys)
    })
  }

  return (
    <Layout>
      <Sider
        style={{ background: '#f0f2f5' }}
        width="25%"
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
          <OperationToolBar
            form={form}
            currentTreeNode={currentTreeNode}
            onTreeNodeFold={onTreeNodeFold}
            setConnectionModalType={setConnectionModalType}
            handleConnectionModalVisible={handleConnectionModalVisible}
            handleDataModalVisible={handleDataModalVisible}
            handleRemoveRedisConnection={handleRemoveRedisConnection}
            refreshCurrentConnectionDatabase={refreshCurrentConnectionDatabase}
            refreshCurrentDatabaseKeys={refreshCurrentDatabaseKeys}
            clearExpanded={clearExpanded}
            clearSelected={clearSelected}
            loadAllRedisConnection={loadAllRedisConnection}
          />
          <Scrollbars
            autoHide
            style={{
              marginTop: 20, height: 'calc(100% - 104px)'
            }}>
            {loadingTree ?
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Spin />
              </div> :
              <Tree
                showLine
                showIcon
                //loadData={onLoadData}
                switcherIcon={<CaretDownOutlined />}
                onExpand={onTreeNodeExpand}
                onSelect={onTreeNodeSelect}
                selectedKeys={selectedKeys}
                expandedKeys={expandedKeys}
                treeData={redisConnectionData}
              />}

          </Scrollbars>
        </Card>
      </Sider>
      <Layout>
        <Card style={{ height: '52px' }} bordered={false}>
        </Card>
        <Content style={{ height: 'calc(100% - 128px)' }}>
          <ValueDisplayCard
            form={textAreaForm}
            currentTreeNode={currentTreeNode}
            onRedisValueUpdate={onRedisValueUpdate}
            handleRemoveRedisKey={handleRemoveRedisKey}
            handleRenameRedisKey={handleRenameRedisKey}
            //handleRefreshRedisValue={handleRefreshRedisValue}
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
        refreshCurrentDatabaseKeys={refreshCurrentDatabaseKeys}
      />
    </Layout >
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(HomePage);
