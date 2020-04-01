import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  const formData = new FormData();
  if (params) {
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    })
  }
  return request('/login', {
    method: 'POST',
    requestType: "form",
    body: formData,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/login/captcha?mobile=${mobile}`);
}
