import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import UserTable from './UserTable';
import Search from './Search';

class App extends React.Component {
  render() {
    return (
      <PageHeaderWrapper className={styles.main}>
        <Search />
        <UserTable />
      </PageHeaderWrapper>
    );
  }
}

export default App;
/*export default () => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <PageHeaderWrapper className={styles.main}>
      <InputBasic />
      <TableAjax />
      {/!*<div
        style={{
          paddingTop: 100,
          textAlign: 'center',
        }}
      >
      </div>*!/}
    </PageHeaderWrapper>
  );
};*/
