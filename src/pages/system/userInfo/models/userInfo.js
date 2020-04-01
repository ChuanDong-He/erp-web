import request from '@/utils/request';

export default {
  namespace: 'userInfo',
  state: {
    data: [],
    pagination: {},
    selectedUserIds: [],
    userInfoVisible: false,
    selectedRowKeys: [],
    queryCondition: {
      userId: '',
      userName: '',
    },
  },

  effects: {
    *queryUserInfo({ payload }, { call, put }) {
      const options = {
        data: JSON.stringify(payload),
      };
      const response = yield call(
        options => request.post('/userInfo/queryUserInfos', options),
        options,
      );
      yield put({
        type: 'dataHandle',
        payload: response,
      });

      yield put({
        type: 'changeState',
        newState: { selectedRowKeys: [], selectedUserIds: [] },
      });
    },
    *deleteUserInfo({ payload }, { call, put, select }) {
      const options = {
        data: JSON.stringify(payload),
        requestType: 'json',
      };
      yield call(options => request.post('/userInfo/deleteUserInfo', options), options);

      const state = yield select(({ userInfo }) => userInfo);
      yield put({
        type: 'queryUserInfo',
        payload: {
          pageSize: state.pagination.pageSize,
          pageNum: 1,
          param: {
            ...state.queryCondition,
          },
        },
      });
    },
  },

  reducers: {
    dataHandle(state, { payload }) {
      // 异常情况
      if (payload && payload.status) {
        return { ...state };
      }
      return {
        ...state,
        data: payload.data.list,
        pagination: payload.data.pagination,
      };
    },
    changeState(state, { newState }) {
      console.log(newState);
      return { ...state, ...newState };
    },
  },
};
