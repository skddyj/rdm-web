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
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  queryAllRedisConnection, queryDatabase, queryRedisKeys,
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
  /** RedisData?????? */
  const [loadingTree, handleLoadingTree] = useState<boolean>(true);

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
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
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
              title: e.name, key: `${e.id}`, connectionKey: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
            }
          });
          handleLoadingTree(false)
          setRedisConnectionData(data);
        }
      });
    } catch (error) {
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
          refreshDatabaseKeys(currentTreeNode);
          clearSelected()
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
          refreshDatabaseKeys(currentTreeNode);
          clearSelected()
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

  /**
   * ??????Redis??????????????????Key
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
      message.error('??????Keys??????');
    }
  };


  /**
   * ??????Redis Key??????Value
   */
  const handleUpdateRedisValue = async (fields) => {
    const hide = message.loading('????????????');
    try {
      return await setKeyValue(fields).then((response) => {
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
  }

  /** 
   * ??????????????????
   */
  const clearExpanded = () => {
    setExpandedKeys([])
  }

  /** 
   * ??????????????? 
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
   * ??????Redis Key??????Value
   */
  const onRedisValueUpdate = () => {
    const { connectionId, databaseId, redisKey } = currentTreeNode;
    const { redisValue } = textAreaForm.getFieldsValue();
    handleUpdateRedisValue({ connectionId, databaseId, key: redisKey, value: redisValue })
  };

  /**
   * ?????????????????????
   */
  // const onLoadData = ({ key, title, children, level, connectionId, databaseId }) => {
  //   const treeNodeKey = key;
  //   return new Promise<void>(resolve => {
  //     if (children && children.length > 0) {
  //       resolve();
  //       return;
  //     }
  //     if (level === 1) {
  //       getRedisDatabase(connectionId).then((databaseCount) => {
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
    const { key, title, children, level, connectionId, databaseId, connectionKey, databaseKey } = node;
    const treeNodeKey = key;
    if (bool) {
      if (children && children.length > 0) {
        setExpandedKeys(expandedKeys);
        return;
      }
      if (level === 1) {
        getRedisDatabase(connectionId).then((databaseCount) => {
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
   * ????????????Database??????Key
   */
  const refreshCurrentDatabase = () => {
    refreshDatabaseKeys(currentTreeNode);
  }

  /**
   * ??????Database??????Key
   */
  const refreshDatabaseKeys = (node) => {
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
   * ?????????????????????Database
   */
  const refreshCurrentConnection = () => {
    refreshConnectionDatabase(currentTreeNode);
  }

  /**
   * ???????????????Database
   */
  const refreshConnectionDatabase = (node) => {
    const { key, connectionId, connectionKey } = node;
    setRedisConnectionData(origin =>
      updateRedisConnectionData(origin, connectionKey, []),
    );
    getRedisDatabase(connectionId).then((databaseCount) => {
      const databaseData = Array.from({ length: databaseCount }, (k, v) => {
        return {
          title: `database ${v}`, key: `${connectionKey}-${v}`, connectionKey, databaseKey: `${connectionKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined />
        }
      })
      setRedisConnectionData(origin =>
        updateRedisConnectionData(origin, connectionKey, databaseData),
      );
      // ????????????Redis???????????????database
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
            ??????Redis??????
          </Button>
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
