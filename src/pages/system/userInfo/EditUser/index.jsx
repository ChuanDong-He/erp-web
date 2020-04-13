import React, {Component} from 'react';
import { Steps, Form, Input, Col, Row } from 'antd';
import { connect } from 'umi';

@connect(({ userInfo }) => ({ ...userInfo }))
class EditUser extends Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <Steps>
          <Steps.Step title={'基本信息'}/>
          <Steps.Step title={'角色选择'}/>
          <Steps.Step title={'权限选择'}/>
        </Steps>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={'userId'} label={'用户账号'} rules={[{required: true, message: '请输入账号'}]}>
                <Input placeholder={'请输入账号'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'userName'} label={'用户姓名'} rules={[{required: true, message: '请输入用户姓名'}]}>
                <Input placeholder={'请输入账号'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={'password'} label={'密码'} rules={[{required: true, message: '请输入密码'}]}>
                <Input.Password placeholder={'请输入密码'} autoComplete="new-password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={'confirm'}
                label={'确认密码'}
                rules={[
                  {required: true, message: '请输入密码'},
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('两次输入的密码不一致!');
                    },
                  })
                ]}
                dependencies={['password']}
              >
                <Input.Password placeholder={'请输入密码'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={'phoneNumber'} label={'电话号码'} >
                <Input placeholder={'请输入电话号码'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'telephoneNumber'} label={'座机号码'} rules={[{required: true, message: '请输入账号'}]}>
                <Input placeholder={'请输入账号'} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={'faxNumber'} label={'传真号码'} rules={[{required: true, message: '请输入账号'}]}>
                <Input placeholder={'请输入账号'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={'roleId'} label={'角色'} rules={[{required: true, message: '请输入账号'}]}>
                <Input placeholder={'请输入账号'} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={'email'} label={'email'} rules={[{required: true, message: '请输入email'}]}>
                <Input placeholder={'请输入email'} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

}

export default EditUser;
