import React from 'react';
import {Modal, Tabs, Tree, Spin, Checkbox, Row, Col, Alert } from 'antd';
import { connect } from 'umi';
import styles from '@/utils/default.less';

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
    let attrs = [];
    this.props.attrPermissionInfos.forEach((item, i) => {
        attrs = [ ...attrs, ...this.props['checkedList_' + i]];
    });
    console.log(attrs);

    this.props.saveRolePermission({
      roleId: this.props.roleId,
      menuPermission: this.props.roleMenuPermissionKeys,
      attrs: attrs,
    });
  };

  onCheck = checkedKeys => {
    this.props.changeState({
      roleMenuPermissionKeys: checkedKeys
    });
  };

  onCheckAllChange = (e, i) => {
    const data = {};
    data['indeterminate_' + i] = false;
    data['checkAll_' + i] = e.target.checked;
    data['checkedList_' + i] = e.target.checked ? this.groups[i] : [];
    this.props.changeState({
      ...data
    });
  };

  onChange = (checkedValues, i) => {
    const data = {};
    data['checkedList_' + i] = checkedValues;
    data['indeterminate_' + i] = !!checkedValues.length && checkedValues.length < this.groups[i].length;
    data['checkAll_' + i] = checkedValues.length === this.groups[i].length;
    this.props.changeState({
      ...data
    });
  };

  groups = {};

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
    this.props.attrPermissionInfos.forEach((attrPermissionInfo, i) => {
      let row = [];
      let group = [];
      attrPermissionInfo.attrInfos.forEach((attrInfo, index) => {
        group.push(attrInfo.attrId);
        row.push(
          <Col span={8} key={index}>
            <Checkbox value={attrInfo.attrId}>{attrInfo.name}</Checkbox>
          </Col>
        );
      });
      this.groups[i] = group;
      attrPermission.push(
        <div style={{marginBottom: '8px'}} key={i}>
          <div style={{borderBottom: '1px solid #e9e9e9'}}>
            <Checkbox
              indeterminate={this.props['indeterminate_' + i]}
              checked={this.props['checkAll_' + i]}
              onChange={(e) => this.onCheckAllChange(e, i)}
            >
              {attrPermissionInfo.target}
            </Checkbox>
          </div>
          <Checkbox.Group
            style={{ width: '100%', marginTop: '5px' }}
            onChange={(checkedValues) => this.onChange(checkedValues, i)}
            value={this.props['checkedList_' + i]}
          >
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
            <div className={styles.alert}>
              <Alert message="选中的为角色无权限查看" type="info" showIcon style={{marginBottom: '10px'}} />
            </div>
            {attrPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab={'功能配置'} style={{outline: "none"}}>功能配置</Tabs.TabPane>
        </Tabs>
      </Modal>
    )
  }
}

export default Permission;
