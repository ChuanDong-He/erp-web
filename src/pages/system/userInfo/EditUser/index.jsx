import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, {Component} from 'react';
import {Steps, Form, Input, Col, Row, Select, Button, Space, Layout} from 'antd';
import { connect, history } from 'umi';
import UserPermission from "../UserPermission";
import styles from "@/utils/default.less";

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

  state = {
    preButton: '返回',
    nextButton: '下一步'
  };

  pre = () => {
    if (this.state.preButton === '返回') {
      history.push('/system/user_info');
    } else {
      this.setState({preButton: '返回', nextButton: '下一步'});
    }
  }

  next = () => {
    if (this.state.nextButton === '下一步') {
      this.setState({preButton: '上一步', nextButton: '保存'});
    } else {
      // 保存数据

      history.push('/system/user_info');
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const children = [];
    this.props.roleInfos.forEach(roleInfo => {
      children.push(<Select.Option key={roleInfo.roleId}>{roleInfo.roleName}</Select.Option>);
    })
    return (
        <PageHeaderWrapper className={styles.main}>
          <div>
            <div style={{margin: "15px auto 30px", maxWidth: 700}}>
              <Steps size={"small"}>
                <Steps.Step title={'基本信息'} status={this.state.preButton === '返回' ? 'process' : 'finish'}/>
                <Steps.Step title={'权限选择'} status={this.state.nextButton === '保存' ? 'process' : 'wait'}/>
              </Steps>
            </div>
            <div style={{padding: '20px 0', display: this.state.nextButton === '保存' ? 'none' : ''}}>
              <Form { ...formItemLayout } ref={form => this.userForm = form} style={{margin: '0 auto', maxWidth: 800}}>
                <Col>
                  <Form.Item name={'userId'} label={'用户账号'} rules={[{required: true, message: '请输入账号'}]}>
                    <Input placeholder={'请输入账号'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'userName'} label={'用户姓名'} rules={[{required: true, message: '请输入用户姓名'}]}>
                    <Input placeholder={'请输入用户姓名'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'password'} label={'密码'} rules={[{required: true, message: '请输入密码'}]}>
                    <Input.Password placeholder={'请输入密码'} autoComplete="new-password" />
                  </Form.Item>
                </Col>
                <Col>
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
                <Col>
                  <Form.Item name={'phoneNumber'} label={'电话号码'} >
                    <Input placeholder={'请输入电话号码'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'telephoneNumber'} label={'座机号码'}>
                    <Input placeholder={'请输入座机号码'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'faxNumber'} label={'传真号码'}>
                    <Input placeholder={'请输入传真号码'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'email'} label={'email'}>
                    <Input placeholder={'请输入email'} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'roleId'} label={'角色'} rules={[{required: true, message: '请选择角色'}]}>
                    <Select mode="multiple" placeholder={'请选择角色'}>
                      {children}
                    </Select>
                  </Form.Item>
                </Col>
              </Form>
            </div>
            <div style={{margin: '20px auto', display: this.state.nextButton === '下一步' ? 'none' : '', maxWidth: 700}}>
              <UserPermission />
            </div>
            <div style={{textAlign: "center", margin: '30 auto', paddingBottom: '15px'}}>
              <Button style={{marginRight: 8}} onClick={() => this.pre()}>{this.state.preButton}</Button>
              <Button type="primary" onClick={() => this.next()}>{this.state.nextButton}</Button>
            </div>
          </div>
        </PageHeaderWrapper>

  );
  }

  componentDidMount() {
    //this.props.onRef(this);
    this.props.queryRoleInfos();
  }

  validateUserForm = () => {
    return this.userForm.validateFields();
  }

}

export default EditUser;
