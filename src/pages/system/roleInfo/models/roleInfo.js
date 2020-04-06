import request from '@/utils/request';
import { message } from "antd";

export default {
  namespace: 'roleInfo',
  state: {
    data: [],
    pagination: {},
    selectedRoleIds: [],
    permissionVisible: false,
    menuTreeInfos: [],
    roleMenuPermissionKeys: [],
    queryCondition: {},
  },

  effects: {
    *queryRoleInfos({ payload }, { call, put }) {
      const response = yield call(request.post, '/roleInfo/queryRoleInfos', { data: payload });
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: {
          selectedRowKeys: [],
          selectedRoleIds: [],
          data: response.data.list,
          pagination: response.data.pagination,
        },
      });
    },
    *queryRoleMenuPermission({ payload }, { call, put }) {
      const response = yield call(request.get, `/roleInfo/queryRoleMenuPermission/${payload.roleId}`);
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: {
          ...response.data
        },
      });
    },
    *saveRolePermission({ payload }, { call, put }) {
      const response = yield call(request.post, `/roleInfo/saveRolePermission`, { data: payload });
      if (response && response.status) {
        return;
      }
      yield put({
        type: 'changeState',
        newState: { permissionVisible: false },
      });
      message.success(response.msg);
    },
    *deleteRoleInfo({ payload }, { call, put, select }) {
      const response = yield call(request.post, '/roleInfo/deleteRoleInfo', { data: payload });
      if (response && response.status) {
        return;
      }
      const state = yield select(({ roleInfo }) => roleInfo);
      yield put({
        type: 'queryRoleInfos',
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
  },

  reducers: {
    changeState(state, { newState }) {
      return { ...state, ...newState };
    }
  },
};
