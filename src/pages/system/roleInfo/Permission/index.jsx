import React from 'react';
import {Modal, Tabs, Tree, Spin, Checkbox, Row, Col, Alert } from 'antd';
import { connect } from 'umi';

@connect(
  ({ roleInfo, loading }) => ({
    ...roleInfo,
    menuLoading: loading.effects['roleInfo/queryRoleMenuPermission'],
    savePermissionLoading: loading.effects['roleInfo/saveRolePermission'],
  }),
  (dispatch) => ({
  changeState: (state) => {
    dispatch({
      type: 'roleInfo/changeState',
      newState: state
    })
  },
  saveRolePermission: param => {
    dispatch({
      type: 'roleInfo/saveRolePermission',
      payload: param
    })
  },
}))
class Permission extends React.Component{

  constructor(props) {
    super(props);
  }

  okHandle = () => {
    this.props.saveRolePermission({
      roleId: this.props.roleId,
      menuPermission: this.props.roleMenuPermissionKeys,
    });
  };

  onCheck = checkedKeys => {
    this.props.changeState({
      roleMenuPermissionKeys: checkedKeys
    });
  };

  render() {
    let menuPermission;
    if (this.props.menuLoading) {
      menuPermission = (
        <div style={{'textAlign': 'center', 'margin': '20px 0', 'padding': '30px 50px'}}>
          <Spin tip="Loading..." spinning={this.props.menuLoading} />
        </div>
      );
    } else {
      menuPermission = (
        <Tree
          checkable={true}
          treeData={this.props.menuTreeInfos}
          defaultCheckedKeys={this.props.roleMenuPermissionKeys}
          defaultExpandAll={true}
          selectable={false}
          onCheck={this.onCheck}
        />
      );
    }
    let attrPermission = [];
    this.props.attrPermissionInfos.forEach(attrPermissionInfo => {
      let row = [];
      attrPermissionInfo.attrInfos.forEach(attrInfo => {
        row.push(
          <Col span={8}>
            <Checkbox value='attrInfo.attrId'>{attrInfo.name}</Checkbox>
          </Col>
        );
      });
      attrPermission.push(
        <div style={{marginBottom: '8px'}}>
          <div style={{borderBottom: '1px solid #e9e9e9'}}>
            <Checkbox indeterminate={true}>{attrPermissionInfo.target}</Checkbox>
          </div>
          <Checkbox.Group style={{ width: '100%', marginTop: '5px' }}>
            <Row>
              {row}
            </Row>
          </Checkbox.Group>
        </div>
      )
    });

    return (
      <Modal
        title={'权限配置'}
        visible={this.props.permissionVisible}
        width={600}
        destroyOnClose={true}
        onCancel={() => {this.props.changeState({permissionVisible: false})}}
        confirmLoading={this.props.savePermissionLoading}
        onOk={this.okHandle}
      >
        <Tabs defaultActiveKey={'1'} tabPosition={'left'}>
          <Tabs.TabPane key={'1'} tab={'菜单配置'} style={{outline: "none"}}>
            {menuPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab={'数据配置'} style={{outline: "none"}}>
            <Alert message="选中的为角色无权限查看" type="warning" showIcon style={{marginBottom: '10px'}}/>
            {attrPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab={'功能配置'} style={{outline: "none"}}>功能配置</Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }
}

export default Permission;
