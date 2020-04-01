import request from '@/utils/request';

export default {
  namespace: 'userInfo',
  state: {
    data: [],
    pagination: {},
    selectedUserIds: [],
    userInfoVisible: false,
    queryCondition: {
      userId: '',
      userName: '',
    },
  },

  effects: {
    *queryUserInfo({ payload }, { call, put }) {
      const response = yield call(request.post, '/userInfo/queryUserInfos', { data: payload });
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
      yield call(request.post, '/userInfo/deleteUserInfo', { data: payload });

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
      return { ...state, ...newState };
    },
  },
};
