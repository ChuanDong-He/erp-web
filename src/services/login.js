import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request.post('/login', { requestType: "form", data: params });
}
export async function getFakeCaptcha(mobile) {
  return request(`/login/captcha?mobile=${mobile}`);
}
