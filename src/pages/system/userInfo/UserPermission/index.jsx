import React from 'react';
import { Tabs, Tree, Spin, Checkbox, Row, Col, Alert } from 'antd';
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
class UserPermission extends React.Component{

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  okHandle = () => {
    const attrs = [];
    this.props.attrPermissionInfos.forEach((item, i) => {
      attrs.push(...this.props.attrData['checkedList_' + i]);
    });

    const operations = [];
    this.props.operationPermissionInfos.forEach((item, i) => {
      operations.push(...this.props.operationData['checkedList_' + i]);
    });

    this.props.saveRolePermission({
      roleId: this.props.roleId,
      menuPermission: this.props.roleMenuPermissionKeys,
      attrs: attrs,
      operations: operations,
    });
  };

  onCheck = checkedKeys => {
    this.props.changeState({
      roleMenuPermissionKeys: checkedKeys
    });
  };

  onCheckAllChangeAttr = (e, i) => {
    const data = {};
    data['indeterminate_' + i] = false;
    data['checkAll_' + i] = e.target.checked;
    data['checkedList_' + i] = e.target.checked ? this.attrGroups[i] : [];
    this.props.changeState({
      attrData: { ...this.props.attrData, ...data }
    });
  };

  onChangeAttr = (checkedValues, i) => {
    const data = {};
    data['checkedList_' + i] = checkedValues;
    data['indeterminate_' + i] = !!checkedValues.length && checkedValues.length < this.attrGroups[i].length;
    data['checkAll_' + i] = checkedValues.length === this.attrGroups[i].length;
    this.props.changeState({
      attrData: { ...this.props.attrData, ...data }
    });
  };

  onCheckAllChangeOperation = (e, i) => {
    const data = {};
    data['indeterminate_' + i] = false;
    data['checkAll_' + i] = e.target.checked;
    data['checkedList_' + i] = e.target.checked ? this.operationGroups[i] : [];
    this.props.changeState({
      operationData: { ...this.props.operationData, ...data }
    });
  };

  onChangeOperation = (checkedValues, i) => {
    const data = {};
    data['checkedList_' + i] = checkedValues;
    data['indeterminate_' + i] = !!checkedValues.length && checkedValues.length < this.operationGroups[i].length;
    data['checkAll_' + i] = checkedValues.length === this.operationGroups[i].length;
    this.props.changeState({
      operationData: { ...this.props.operationData, ...data }
    });
  };

  attrGroups = {};

  operationGroups = {};

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
      this.attrGroups[i] = group;
      attrPermission.push(
        <div style={{marginBottom: '8px'}} key={i}>
          <div style={{borderBottom: '1px solid #e9e9e9'}}>
            <Checkbox
              indeterminate={this.props.attrData['indeterminate_' + i]}
              checked={this.props.attrData['checkAll_' + i]}
              onChange={(e) => this.onCheckAllChangeAttr(e, i)}
            >
              {attrPermissionInfo.target}
            </Checkbox>
          </div>
          <Checkbox.Group
            style={{ width: '100%', marginTop: '5px' }}
            onChange={(checkedValues) => this.onChangeAttr(checkedValues, i)}
            value={this.props.attrData['checkedList_' + i]}
          >
            <Row>
              {row}
            </Row>
          </Checkbox.Group>
        </div>
      )
    });

    let operationPermission = [];
    this.props.operationPermissionInfos.forEach((operationPermissionInfo, i) => {
      let row = [];
      let group = [];
      operationPermissionInfo.operationInfos.forEach((operationInfo, index) => {
        group.push(operationInfo.operationId);
        row.push(
          <Col span={8} key={index}>
            <Checkbox value={operationInfo.operationId}>{operationInfo.name}</Checkbox>
          </Col>
        );
      });
      this.operationGroups[i] = group;
      operationPermission.push(
        <div style={{marginBottom: '8px'}} key={i}>
          <div style={{borderBottom: '1px solid #e9e9e9'}}>
            <Checkbox
              indeterminate={this.props.operationData['indeterminate_' + i]}
              checked={this.props.operationData['checkAll_' + i]}
              onChange={(e) => this.onCheckAllChangeOperation(e, i)}
            >
              {operationPermissionInfo.target}
            </Checkbox>
          </div>
          <Checkbox.Group
            style={{ width: '100%', marginTop: '5px' }}
            onChange={(checkedValues) => this.onChangeOperation(checkedValues, i)}
            value={this.props.operationData['checkedList_' + i]}
          >
            <Row>
              {row}
            </Row>
          </Checkbox.Group>
        </div>
      )
    });

    return (
      <div>
        <Tabs defaultActiveKey={'1'} tabPosition={'left'}>
          <Tabs.TabPane key={'1'} tab={'菜单配置'} style={{outline: "none"}}>
            {menuPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'2'} tab={'数据配置'} style={{outline: "none"}}>
            <div className={styles.alert}>
              <Alert message="选中为该角色无权限查看" type="info" showIcon style={{marginBottom: '10px'}} />
            </div>
            {attrPermission}
          </Tabs.TabPane>
          <Tabs.TabPane key={'3'} tab={'功能配置'} style={{outline: "none"}}>
            {operationPermission}
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  }
}

export default UserPermission;
