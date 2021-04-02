import React, { useEffect } from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, Typography, Popover, Tooltip, Space, Breadcrumb } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

const { TextArea, Search } = Input;
const { confirm } = Modal;
const { Title } = Typography;

export enum ModalType { Create, Update };

export type PathAreaProps = {
  currentTreeNode;
  currentRedisKey;
};

const PathArea: React.FC<PathAreaProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const {
    currentTreeNode,
    currentRedisKey
  } = props;

  const ellipsis = {
    rows: 1,
    expandable: false
  }


  const getCurrentPath = () => {
    let path = '';
    if (currentTreeNode && currentTreeNode.level === 1) {
      path = currentTreeNode.connectionName
      return <Title ellipsis={{ ...ellipsis, tooltip: path }} level={4}>{path}</Title>;
    }
    if (currentTreeNode && currentTreeNode.level === 2) {
      if (currentRedisKey) {
        path = `${currentTreeNode.connectionName}/${currentTreeNode.databaseName}/${currentRedisKey}`;
        return <Title ellipsis={{ ...ellipsis, tooltip: path }} level={4} > {path}</Title >;
      }
      path = `${currentTreeNode.connectionName}/${currentTreeNode.databaseName}`;
      return <Title ellipsis={{ ...ellipsis, tooltip: path }} level={4}>{path}</Title>;
    }
    return path;
  }

  return (
    getCurrentPath()
  );
};

export default PathArea;
