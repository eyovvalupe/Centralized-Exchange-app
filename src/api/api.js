import http from "./request";
import axios from "axios";

const baseURL = process.env.NODE_ENV === 'development' ? "/api" : ''
// 上传文件
// export const _upload = (file, successFunc, errorFunc, finishFunc) => {
//   const form = new FormData()
//   form.append("file", file)
//   return http.post("/file/upload", form, {
//     custom: { toast: true, auth: false, "Content-Type": "multipart/form-data"},
//   }).then(res => {
//     if (successFunc) successFunc(res)
//   }).catch(err => {
//     if (errorFunc) errorFunc(err)
//   }).finally(() => {
//     if (finishFunc) finishFunc()
//   });
// };

// 获取验证码
export const _verifcode = () => {
  return axios.get(baseURL + "/anon/v1/comm/verifcode", { responseType: 'blob' })
};

// 登录
export const _login = (data = {}) => {
  return http.post(`/anon/v1/user/login`, data, {
    custom: { auth: false, toast: false },
  });
};

export const memberInfo = () => { }