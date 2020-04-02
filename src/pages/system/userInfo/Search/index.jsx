import React, {Component} from 'react';
import {Input, Button} from 'antd';
import styles from './index.less';
import { connect } from 'umi';

@connect(({ userInfo }) => ({ ...userInfo }), (dispatch) => ({
  queryUserInfo: (param) => {
    dispatch({
      type: 'userInfo/queryUserInfo',
      payload: param
    })
  },
  changeState: (state) => {
    dispatch({
      type: 'userInfo/changeState',
      newState: state
    })
  }
}))
class SearchUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {userId: ``, userName: ``};
  }

  search = () => {
    this.props.changeState({
      queryCondition: { ...this.state }
    });
    const { pageSize = 10 } = this.props.pagination;
    this.props.queryUserInfo({
      pageSize: pageSize,
      pageNum: 1,
      param: { ...this.state }
    });
  };

  reset = () => {
    this.setState({
      userId: ``,
      userName: ``
    }, () => this.search());
  };

  render() {
    return (
      <div className={styles.container}>
        <Input placeholder="账号" className={styles.searchInput} onChange={event => {
          this.setState({userId: event.target.value})
        }} allowClear={true} value={this.state.userId}/>
        <Input placeholder="用户名" className={styles.searchInput} style={{marginLeft: 8}} onChange={event => {
          this.setState({userName: event.target.value})
        }} allowClear={true} value={this.state.userName}/>
        <Button type="primary" style={{marginLeft: 8}} onClick={this.search.bind(this)}>查询</Button>
        <Button type="primary" style={{marginLeft: 8}} onClick={this.reset.bind(this)}>重置</Button>
      </div>
    )
  }
}


export default SearchUserInfo;
