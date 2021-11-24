import React, { useEffect } from 'react';
import { Button, Divider, Layout, Menu, Tree, message, Select, Card, Input, Form, Modal, InputNumber, Popover, Tooltip, Space, Breadcrumb } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import {
  SaveOutlined,
  CaretDownOutlined,
  DatabaseOutlined,
  FileAddOutlined,
  SyncOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { queryRedisValue, updateRedisValue } from './service'

const { TextArea, Search } = Input;
const { confirm } = Modal;

export enum ModalType { Create, Update };

export type StringValueDisplayAreaProps = {
  currentTreeNode;
  currentRedisKey;
};

const StringValueDisplayArea: React.FC<StringValueDisplayAreaProps> = (props) => {
  /** 国际化 */
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const {
    currentTreeNode,
    currentRedisKey
  } = props;

  useEffect(() => {
    if (currentRedisKey) {
      getStringKeyValue().then((value) => {
        form.setFieldsValue({ stringRedisValue: value })
      });
    }
  }, [currentRedisKey]);

  /**
* 更新Redis Key对应Value
*/
  const handleUpdateRedisValue = async (fields) => {
    const hide = message.loading(formatMessage({ "id": "message.redis.connection.saving.content" }));
    try {
      return await updateRedisValue({ ...fields }).then((response) => {
        if (response && response.success) {
          hide();
          message.success(formatMessage({ "id": "message.redis.connection.saveSucceed.content" }));
          return true;
        }
        throw new Error(response.message);
      });
    } catch (error) {
      hide();
      message.error(formatMessage({ "id": "message.redis.connection.saveFailed.content" }) + error);
      return false;
    }
  };

  /**
 * 更新Redis Key对应Value
 */
  const saveRedisValue = () => {
    const { connectionId, databaseId } = currentTreeNode;
    const { stringRedisValue } = form.getFieldsValue();
    handleUpdateRedisValue({ connectionId, databaseId, key: currentRedisKey, newRowValue: stringRedisValue })
  };

  const getStringKeyValue = async () => {
    const { connectionId, databaseId } = currentTreeNode
    try {
      return await queryRedisValue({ connectionId, databaseId, key: currentRedisKey, type: 'string' }).then((response) => {
        if (response && response.success) {
          return response.result.value;
        }
        throw new Error(response.message);
      })
    } catch (error) {
      message.error(formatMessage({ "id": "message.redis.connection.querykeyFailed.content" }) + error);
    }
  }

  return (
    <div style={{ height: '100%' }}>
      <Card bordered={false} style={{ height: "100%" }} bodyStyle={{ height: "100%", padding: "0px 24px" }}>
        <div style={{ float: "right", padding: '16px 0' }}>
          <Button type="primary"
            onClick={saveRedisValue}
            icon={<SaveOutlined />}
          >
            {formatMessage({ "id": "button.common.save" })}
          </Button>
        </div>
        <Form
          form={form}
          style={{ height: 'calc(100% - 64px)' }}
          name="stringRedisValueForm"
        >
          <Form.Item
            label='Value'
            name="stringRedisValue"
            noStyle
            rules={[{ required: true, message: formatMessage({ "id": "modal.redis.key.string.value.required" }) }]}
          >
            <TextArea style={{ height: '100%', fontSize: '16px' }} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StringValueDisplayArea;
