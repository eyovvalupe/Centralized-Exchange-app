import http from "./request";

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
  return http.get(`/anon/v1/comm/verifcode`, {
    custom: { auth: false, toast: false },
  });
};

// 获取腾讯认证结果
export const memberInfo = () => {
  return http.get(`/memberCertificate/tencentQueryFaceRecord/1`, {
    custom: { auth: true, toast: false },
  });
};
// 创建出售订单校验 
export const createSellOrderVerify = (data = {}) => {
  return http.post(`/cfbOtcOrder/createSellOrderVerify`, data, {
    custom: { auth: true, toast: true },
  });
};