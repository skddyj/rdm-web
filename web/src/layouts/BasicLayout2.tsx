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
import { Result, Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { getMatchMenu } from '@umijs/route-utils';
import ProCard from "@ant-design/pro-card";
import logo from '../assets/logo.svg';
import DraggleLayout from './DraggleLayout'
const { Header, Content, Footer, Sider } = Layout;
import {
  EditOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  RedoOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  queryAllRedisConnection, queryDatabaseCount, queryDatabaseKeys,
  queryKeyValue, updateRedisConnection, addRedisConnection,
  removeRedisConnection, testRedisConnection,
  setKeyValue
} from './service';

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

const getAllRedisConnection = async () => {
  try {
    return await queryAllRedisConnection().then((response) => {
      if (response && response.success) {
        return response.result.map((e) => {
          return {
            title: e.name, key: `${e.id}`, level: 1, connectionId: e.id, isLeaf: false, redisConnectionVo: e, icon: < DatabaseOutlined />
          }
        })
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
    message.error('查询Keys失败');
    return 0;
  }
};

const getKeyValue = async (redisConnectionId, databaseId, key) => {
  try {
    return await queryKeyValue({ redisConnectionId, databaseId, key }).then((response) => {
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

/**
 * 添加连接
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');
  try {
    return await addRedisConnection({ ...fields }).then((response) => {
      console.log("response", response)
      if (response && response.success) {
        hide();
        message.success('添加成功');
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
 * 修改连接
 */
const handleUpdate = async (fields) => {
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
 * 删除连接
 */
const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const keys = selectedRows.map((row) => row.connectionId)
    console.log("keys", keys)
    return await removeRedisConnection(keys).then((response) => {
      console.log("删除response", response)
      if (response && response.success) {
        hide();
        message.success('删除成功');
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
 * 测试连接
 */
const handleTestConnection = async (fields) => {
  const hide = message.loading('正在测试连接');
  try {
    await testRedisConnection(fields).then((response) => {
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
 * 测试连接
 */
const handleSetRedisValue = async (fields) => {
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
    message.error(`删除失败，请重试，失败原因：${error}`);
    return false;
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

  const form = Form.useForm()[0];

  const textAreaForm = Form.useForm()[0];

  /** 所有redis连接数据*/
  const [redisConnectionData, setRedisConnectionData] = useState<[]>([]);

  /** 展开折叠key*/
  const [expandedKeys, setExpandedKeys] = useState<[]>([]);

  /** 所有redis连接数据*/
  const [textareaValue, setTextareaValue] = useState<string>();

  /** 新建Redis连接窗口的弹窗 */
  const [connectionModalVisible, handleConnectionModalVisible] = useState<boolean>(false);
  /** 新建窗口的弹窗 */
  const [connectionModalType, setConnectionModalType] = useState<ModalType>(ModalType.Create);

  /** 当前redisKey*/
  const [currentRedisKey, setCurrentRedisKey] = useState();

  /** 新建Redis连接窗口的弹窗 */
  const [operationBar, setOperationBar] = useState();

  const [currentRow, setCurrentRow] = useState();


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

  /**
 * 测试连接
 */
  const onSaveClick = () => {
    console.log('currentRow', currentRow);
    const { connectionId, databaseId, redisKey } = currentRow;
    const { textareaValue } = textAreaForm.getFieldsValue();
    handleSetRedisValue({ redisConnectionId: connectionId, databaseId, key: redisKey, value: textareaValue })

  };

  // const onLoadData = ({ key, titlle, children, level, connectionId, databaseId }) => {
  //   const treeNodeKey = key;
  //   console.log(treeNodeKey + ':' + level + ':' + connectionId + ':' + databaseId)
  //   return new Promise<void>(resolve => {
  //     if (children && children.length > 0) {
  //       resolve();
  //       return;
  //     }
  //     if (level === 1) {
  //       console.log("连接展开")
  //       getDatabaseCount(connectionId).then((databaseCount) => {
  //         const databaseData = Array.from({ length: databaseCount }, (k, v) => { return { title: `database ${v}`, key: `${treeNodeKey}-${v}`, level: 2, connectionId, databaseId: v, isLeaf: false, icon: < DatabaseOutlined /> } })
  //         setRedisConnectionData(origin =>
  //           updateRedisConnectionData(origin, treeNodeKey, databaseData),
  //         );
  //         resolve();
  //       })
  //     }
  //     else if (level === 2) {
  //       console.log("数据库展开")
  //       getDatabaseKeys(connectionId, databaseId).then((redisKeys) => {
  //         console.log("redisKeys", redisKeys)
  //         const redisKeyData = redisKeys.map((redisKey) => {
  //           return { title: redisKey, key: `${treeNodeKey}-${redisKey}`, level: 3, connectionId, databaseId, redisKey, isLeaf: true, icon: null }
  //         });
  //         console.log("redisKeyData", redisKeyData.length)
  //         setRedisConnectionData(origin =>
  //           updateRedisConnectionData(origin, treeNodeKey, redisKeyData),
  //         );
  //         resolve();
  //       })
  //     }
  //   });
  // }

  const onSelect = (selectedKeys, { selected, selectedNodes, node, event }) => {
    if (selected) {
      setCurrentRow(node);
      if (node.level === 3) {
        console.log("get", node)
        setCurrentRedisKey(node.redisKey)
        keyValueGet(node.connectionId, node.databaseId, node.redisKey)
      }
    } else {
      setCurrentRow(undefined)
    }
  }

  const keyValueGet = (connectionId, databaseId, redisKey,) => {
    getKeyValue(connectionId, databaseId, redisKey,).then((value) => {
      console.log(textAreaForm.getFieldsValue())
      textAreaForm.setFieldsValue({ textareaValue: value });
    })
  };

  const { formatMessage } = useIntl();

  const onExpand = (expandedKeys, { expanded: bool, node }) => {
    //this.onLoadData()
    const { key, titlle, children, level, connectionId, databaseId } = node;
    const treeNodeKey = key;
    if (bool) {
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
  };

  const handleFold = (key) => {
    const newExpandedKeys = [...expandedKeys].filter(e => !e.startsWith(key));
    setExpandedKeys(newExpandedKeys)
  }

  const handleRefreshConnection = () => {
    getAllRedisConnection().then((data) => {
      console.log('handleRefreshConnection', data)
      setRedisConnectionData(data)
    })
  }

  /**
  * 删除连接
  */
  const handleTextAreaValueChange = (e) => {
    console.log(e)
    // setTextareaValue(e.target.value);
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
          <Button
            type="primary"
            block
            onClick={() => {
              setConnectionModalType(ModalType.Create)
              handleConnectionModalVisible(true);
            }}>
            添加Redis连接
          </Button>
          {currentRow && currentRow.level === 1 ? (
            <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
              <Search placeholder="请输入" enterButton />
              <Button title='编辑'
                onClick={() => {
                  handleFold(currentRow.key)
                  form.setFieldsValue(currentRow.redisConnectionVo);
                  setConnectionModalType(ModalType.Update)
                  handleConnectionModalVisible(true);
                }}
                type="primary" icon={<EditOutlined />}></Button>
              <Button title='删除'
                onClick={() => {
                  confirm({
                    title: '删除确认',
                    icon: <ExclamationCircleOutlined />,
                    content: '此操作不可恢复，确认删除吗 ？',
                    onOk() {
                      handleFold(currentRow.key)
                      handleRemove([currentRow]).then((success) => {
                        if (success) {
                          handleRefreshConnection();
                        }
                      });
                    },
                    onCancel() {
                    },
                  });
                }} type="primary" icon={<DeleteOutlined />}></Button>
              <Button title='刷新' type="primary" icon={<RedoOutlined />}></Button>
            </Space>) : (currentRow && currentRow.level === 2 ?
              <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
                <Search placeholder="请输入" enterButton />
                <Button title='新增' type="primary" icon={<FileAddOutlined />} style={{ marginLeft: 10 }} ></Button>
                <Button title='编辑' type="primary" icon={<EditOutlined />} style={{ marginLeft: 10 }} ></Button>
                <Button title='删除' type="primary" icon={<DeleteOutlined />} style={{ marginLeft: 10 }}></Button>
                <Button title='刷新' type="primary" icon={<RedoOutlined />} style={{ marginLeft: 10 }}></Button>
              </Space> :
              <Space size='small' direction='horizontal' style={{ marginTop: 20, height: 32 }}>
                <Search placeholder="请输入" enterButton />
              </Space>
          )}
          <div style={{ marginTop: 10 }}>
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
      </Sider >
      <Layout>
        <Card style={{ height: '15%' }} bordered={false}>
          <Breadcrumb style={{ marginTop: 10 }}>
            <Breadcrumb.Item>本地连接</Breadcrumb.Item>
            <Breadcrumb.Item>
              database 0
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                key1
            </Breadcrumb.Item>
          </Breadcrumb>
        </Card>
        <Content style={{ height: '85%' }}>
          <Card style={{ height: '100%' }} bodyStyle={{ height: '100%' }} bordered={false}>
            <div style={{ height: '20%', float: 'left', width: '50%' }}>

              <Form.Item
                name="Key"
                label='Key'
              >
                <Input value={currentRedisKey} style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div style={{ height: '20%', textAlign: 'right' }}>
              <Space size='large'>
                <Button type="primary" onClick={onSaveClick}>保存</Button>
                <Button type="primary" >重命名</Button>
                <Button type="primary" >删除</Button>
                <Button type="primary" >刷新</Button>
                <Button type="primary" >设置TTL</Button>
              </Space>
            </div>
            <Form
              form={textAreaForm}
              style={{ height: '80%' }}
              name="valueForm"
            >
              <Form.Item
                name="textareaValue"
                noStyle
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <TextArea style={{ height: '100%' }} onChange={handleTextAreaValueChange} />
              </Form.Item>
            </Form>
          </Card>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}> */}
        <Card style={{ height: '10%', textAlign: 'center' }}>
          Developed by Dongyanjun ©2021
          </Card>
        {/* </Footer> */}
      </Layout>
      <Modal
        title={formatMessage({
          id: connectionModalType === ModalType.Create ? 'pages.redisConnectionManage.createForm.newRedisConnection' : 'pages.redisConnectionManage.createForm.updateRedisConnection',
          defaultMessage: connectionModalType === ModalType.Create ? '添加Redis连接' : '修改Redis连接',
        })}
        width="600px"
        destroyOnClose
        visible={connectionModalVisible}
        footer={[
          <Button key="testConnection" onClick={() => {
            form
              .validateFields()
              .then(values => {
                handleTestConnection(values);
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
            测试连接
          </Button>,
          <Button key="back" onClick={() => {
            form.resetFields();
            handleConnectionModalVisible(false);
          }}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => {
            form
              .validateFields()
              .then(values => {
                console.log("values222", values)
                form.resetFields();
                if (connectionModalType === ModalType.Create) {
                  handleAdd(values).then((success) => {
                    console.log("success", success);
                    if (success) {
                      handleRefreshConnection();
                      handleConnectionModalVisible(false);
                    }
                  });
                } else if (connectionModalType === ModalType.Update) {
                  handleUpdate({ id: currentRow?.id, ...values }).then((success) => {
                    console.log("success", success);
                    if (success) {
                      handleRefreshConnection();
                      handleConnectionModalVisible(false);
                    }
                  });
                }
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}>
            确定
          </Button>,
        ]}
        onCancel={() => {
          form.resetFields();
          handleConnectionModalVisible(false);
        }}
      >
        <Form
          {...layout}
          layout="horizontal"
          form={form}
          name="form_in_modal"
        >
          <Form.Item
            name="name"
            label="连接名称"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.name"
                    defaultMessage="连接名称为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入连接名称'
            // disabled={connectionModalType === ModalType.Update}
            />
          </Form.Item >
          <Form.Item
            name="host"
            label="连接地址"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.host"
                    defaultMessage="连接地址为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入连接地址' />
          </Form.Item>
          <Form.Item
            name="port"
            label="连接端口"
            initialValue={6379}
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.port"
                    defaultMessage="连接端口为必填项"
                  />
                ),
              },
            ]}
          >
            <InputNumber placeholder='请输入连接端口' style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="连接密码"
            rules={[
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="pages.redisConnectionManage.password"
                    defaultMessage="连接密码为必填项"
                  />
                ),
              },
            ]}
          >
            <Input placeholder='请输入连接密码' />
          </Form.Item>
          <Form.Item
            name="username"
            label="连接用户名"
          >
            <Input placeholder='请输入连接用户名（选填）' />
          </Form.Item>
        </Form>
      </Modal>
    </Layout >
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout2);
