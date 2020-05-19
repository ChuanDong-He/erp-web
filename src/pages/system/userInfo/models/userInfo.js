import request from '@/utils/request';
import { message } from "antd";

export default {
  namespace: 'userInfo',
  state: {
    data: [],
    pagination: {},
    selectedUserIds: [],
    userInfoVisible: false,
    rePassWordVisible: false,
    queryCondition: {
      userId: '',
      userName: '',
    },
    saveUser: {
      lastStep: '取消',
      nextStep: '下一步',
      isValid: false,
      userForm: null,
    },
    userInfo: {},
    roleInfos: [],
  },

  effects: {
    *queryUserInfos({ payload }, { call, put }) {
      const response = yield call(request.post, '/userInfo/queryUserInfos', { data: payload });
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: {
          selectedRowKeys: [],
          selectedUserIds: [],
          data: response.data.list,
          pagination: response.data.pagination,
        },
      });
    },
    *queryRoleInfos({}, { call, put }) {
      const response = yield call(request.get, '/roleInfo/list');
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: {
          roleInfos: response.data
        },
      });
    },
    *deleteUserInfo({ payload }, { call, put, select }) {
      const response = yield call(request.post, '/userInfo/deleteUserInfo', { data: payload });
      if (response && response.status) {
        return;
      }
      const state = yield select(({ userInfo }) => userInfo);
      yield put({
        type: 'queryUserInfos',
        payload: {
          pageSize: state.pagination.pageSize,
          pageNum: 1,
          param: {
            ...state.queryCondition,
          },
        },
      });
      message.success(response.msg);
    },
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(request.post, '/userInfo/resetPassword', { data: payload });
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: { rePassWordVisible: false },
      });
      message.success(response.msg);
    },
  },

  reducers: {
    changeState(state, { newState }) {
      return { ...state, ...newState };
    }
  },
};
