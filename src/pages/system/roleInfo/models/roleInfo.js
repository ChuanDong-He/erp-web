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
    attrPermissionInfos: [],
    roleMenuPermissionKeys: [],
    queryCondition: {},
    attrData: {},
    operationData: {},
    operationPermissionInfos: [],
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
    *queryRoleOperationPermission({ payload }, { call, put }) {
      const response = yield call(request.get, `/roleInfo/queryRoleOperationPermission/${payload.roleId}`);
      if (response && response.status) {
        return;
      }
      const operationData = {};
      response.data.forEach((item, i) => {
        operationData['indeterminate_' + i] = !!item.roleOperationPermissionKeys.length && item.roleOperationPermissionKeys.length <item.operationInfos.length;
        operationData['checkAll_' + i] = item.operationInfos.length === item.roleOperationPermissionKeys.length;
        operationData['checkedList_' + i] = item.roleOperationPermissionKeys;
      });
      yield put({
        type: 'changeState',
        newState: {
          operationData: operationData,
          operationPermissionInfos: response.data,
        },
      });
    },
    *queryRoleAttrPermission({ payload }, { call, put }) {
      const response = yield call(request.get, `/roleInfo/queryRoleAttrPermission/${payload.roleId}`);
      if (response && response.status) {
        return;
      }
      const attrData = {};
      response.data.forEach((item, i) => {
        attrData['indeterminate_' + i] = !!item.roleAttrPermissionKeys.length && item.roleAttrPermissionKeys.length <item.attrInfos.length;
        attrData['checkAll_' + i] = item.attrInfos.length === item.roleAttrPermissionKeys.length;
        attrData['checkedList_' + i] = item.roleAttrPermissionKeys;
      });
      yield put({
        type: 'changeState',
        newState: {
          attrData: attrData,
          attrPermissionInfos: response.data,
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
