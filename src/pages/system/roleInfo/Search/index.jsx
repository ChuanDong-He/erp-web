import React from 'react';
import {Input, Button} from 'antd';
import styles from './index.less';
import { connect } from 'umi';

@connect(({ roleInfo }) => ({ ...roleInfo }), (dispatch) => ({
  queryRoleInfos: (param) => {
    dispatch({
      type: 'roleInfo/queryRoleInfos',
      payload: param
    })
  },
  changeState: (state) => {
    dispatch({
      type: 'roleInfo/changeState',
      newState: state
    })
  }
}))
class SearchRoleInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {roleName: ``};
  }

  search = () => {
    this.props.changeState({
      queryCondition: { ...this.state }
    });
    const { pageSize = 10 } = this.props.pagination;
    this.props.queryRoleInfos({
      pageSize: pageSize,
      pageNum: 1,
      param: { ...this.state }
    });
  };

  reset = () => {
    this.setState({
      roleName: ``
    }, () => this.search());
  };

  render() {
    return (
      <div className={styles.container}>
        <Input placeholder="角色" className={styles.searchInput} onChange={event => {
          this.setState({roleName: event.target.value})
        }} allowClear={true} value={this.state.userId}/>
        <Button type="primary" style={{marginLeft: 8}} onClick={this.search.bind(this)}>查询</Button>
        <Button type="primary" style={{marginLeft: 8}} onClick={this.reset.bind(this)}>重置</Button>
      </div>
    )
  }
}

export default SearchRoleInfo;
