import React, {Component} from 'react';
import { Steps, Form, Input, Col, Row, Select } from 'antd';
import { connect } from 'umi';
import UserPermission from "../UserPermission";

@connect(
    ({ userInfo }) => ({ ...userInfo }),
    dispatch => ({
      changeState: state => {
        dispatch({
          type: 'userInfo/changeState',
          newState: state,
        });
      },
      queryRoleInfos: () => {
        dispatch({
          type: 'userInfo/queryRoleInfos',
        });
      },
    })
)
class EditUser extends Component {

  constructor(props, context) {
    super(props, context);
  }


  componentDidMount() {
    this.props.onRef(this);
    this.props.queryRoleInfos();
  }

  validateUserForm = () => {
    return this.userForm.validateFields();
  }

  render() {
    const children = [];
    this.props.roleInfos.forEach(roleInfo => {
      children.push(<Select.Option key={roleInfo.roleId}>{roleInfo.roleName}</Select.Option>);
    })
    return (
      <div>
        <div style={{margin: "0 120px 0 120px"}}>
          <Steps size={"small"}>
            <Steps.Step title={'基本信息'} status={this.props.saveUser.lastStep === '取消' ? 'process' : 'finish'}/>
            <Steps.Step title={'权限选择'} status={this.props.saveUser.nextStep === '确认' ? 'process' : 'wait'}/>
          </Steps>
        </div>
        <div style={{marginTop: 10, display: this.props.saveUser.nextStep === '确认' ? 'none' : ''}}>
          <Form layout="vertical" ref={form => this.userForm = form}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={'userId'} label={'用户账号'} rules={[{required: true, message: '请输入账号'}]}>
                  <Input placeholder={'请输入账号'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'userName'} label={'用户姓名'} rules={[{required: true, message: '请输入用户姓名'}]}>
                  <Input placeholder={'请输入用户姓名'} />
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
                <Form.Item name={'telephoneNumber'} label={'座机号码'}>
                  <Input placeholder={'请输入座机号码'} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={'faxNumber'} label={'传真号码'}>
                  <Input placeholder={'请输入传真号码'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={'email'} label={'email'}>
                  <Input placeholder={'请输入email'} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={'roleId'} label={'角色'} rules={[{required: true, message: '请选择角色'}]}>
                  <Select mode="multiple" placeholder={'请选择角色'}>
                    {children}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{marginTop: 20, display: this.props.saveUser.nextStep === '下一步' ? 'none' : ''}}>
          <UserPermission />
        </div>
      </div>
    );
  }

}

export default EditUser;
