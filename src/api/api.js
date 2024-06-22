import http from "./request";
import axios from "axios";
import { BASE_ADDRESS } from "@/config"

const baseURL = process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS
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
// 退出登录
export const _logout = (data = {}) => {
  return http.post(`/authc/v1/user/logout`, data, {
    custom: { auth: true, toast: false },
  });
};

// 获取用户信息
export const _userinfo = (data = {}) => {
  return http.post(`/authc/v1/user/get`, data, {
    custom: { auth: true, toast: false },
  });
};
// 谷歌验证器状态
export const _google = (data = {}) => {
  return http.post(`/authc/v1/user/google/get`, data, {
    custom: { auth: true, toast: true },
  });
};
// 绑定谷歌验证器
export const _googleBind = (data = {}) => {
  return http.post(`/authc/v1/user/google/bind`, data, {
    custom: { auth: true, toast: false },
  });
};

// 自选列表
export const _watchlist = (data = {}) => {
  return http.post(`/anon/v1/market/watchlist/list`, data, {
    custom: { auth: false, toast: true },
  });
};

// 搜索股票
export const _search = (data = {}) => {
  return http.post(`/anon/v1/market/search`, data, {
    custom: { auth: false, toast: true },
  });
};

// 获取股票基本信息
export const _basic = (data = {}) => {
  return http.post(`/anon/v1/item/basic`, data, {
    custom: { auth: false, toast: true },
  });
};

// 获取股票详情
export const _profile = (data = {}) => {
  return http.post(`/anon/v1/item/stock/profile`, data, {
    custom: { auth: false, toast: true },
  });
};

// 获取 K 线历史数据
export const _kline = (data = {}) => {
  return http.get(`/anon/v1/ticker/kline?symbol=${data.symbol}&period=${data.period}&page=${data.page}`, data, {
    custom: { auth: false, toast: true },
  });
};

// 获取分时图历史数据
export const _time = (data = {}) => {
  return http.get(`/anon/v1/ticker/time?symbol=${data.symbol}`, data, {
    custom: { auth: false, toast: true },
  });
};

// 获取市场排序数据
export const _sort = (data = {}) => {
  return http.post(`/anon/v1/market/stock/sort`, data, {
    custom: { auth: false, toast: true },
  });
};

// 订单列表
export const _stocksList = (data = {}) => {
  return http.post(`/authc/v1/stocks/list`, data, {
    custom: { auth: true, toast: true },
  })
};

// 添加自选
export const _add = (data = {}) => {
  return http.post(`/anon/v1/market/watchlist/add`, data, {
    custom: { auth: true, toast: true },
  });
};

//交易参数
export const _stocksPara = (data = {}) => {
  return http.post(`/authc/v1/stocks/para`, data, {
    custom: { auth: true, toast: true },
  });
};

// 移除自选
export const _del = (data = {}) => {
  return http.post(`/anon/v1/market/watchlist/del`, data, {
    custom: { auth: true, toast: true },
  });
};

//钱包余额
export const _walletBalance = (data = {}) => {
  return http.post(`authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true },
  });
}

// 修改密码
export const _updatepw = (data = {}) => {
  return http.post(`/authc/v1/user/updatepw`, data, {
    custom: { auth: true, toast: true },
  });
};

//开仓
export const _stocksBuy = (data = {}) => {
  return http.post(`authc/v1/stocks/buy`, data, {
    custom: { auth: true, toast: true },
  });
};

//SessionToken
export const _commToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: true, toast: true },
  });
};

// 忘记密码
export const _forgetpw = (data = {}) => {
  return http.post(`/anon/v1/user/forgetpw`, data, {
    custom: { auth: false, toast: true },
  });
};

//订单详情
export const _stocksGet = (data = {}) => {
  return http.post(`authc/v1/stocks/get`, data, {
    custom: { auth: true, toast: true },
  });
};

//平仓
export const _stocksSell = (data = {}) => {
  return http.post(`authc/v1/stocks/sell`, data, {
    custom: { auth: true, toast: true },
  });
};

// KYC 状态查询
export const _kycGet = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/get`, data, {
    custom: { auth: true, toast: true },
  });
};
// KYC L1 提交
export const _kyc1 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l1/set`, data, {
    custom: { auth: true, toast: true },
  });
};
// KYC L2 提交
export const _kyc2 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l2/set`, data, {
    custom: { auth: true, toast: true },
  });
};

// SessionToken
export const _sessionToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: false, toast: false },
  });
};
// 用户注册
export const _register = (data = {}) => {
  return http.post(`/anon/v1/user/register`, data, {
    custom: { auth: false, toast: false },
  });
};

// 新闻列表
export const _news = (data = {}) => {
  return http.post(`/anon/v1/market/news`, data, {
    custom: { auth: false, toast: false },
  });
};

// 新增支付方式 
export const _addAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/add`, data, {
    custom: { auth: true, toast: true },
  });
};
// 收款账户列表 
export const _listAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/list`, data, {
    custom: { auth: true, toast: true },
  });
};

// 订单更新
export const _stocksUpdate = (data = {}) => {
  return http.post(`/authc/v1/stocks/update`, data, {
    custom: { auth: true, toast: true },
  });
};


// 总资产
export const _assets = (data = {}) => {
  return http.post(`/authc/v1/account/assets`, data, {
    custom: { auth: true, toast: true },
  });
};
// 现金账户
export const _balance = (data = {}) => {
  return http.post(`/authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true },
  });
};
// 充值记录
export const _depositList = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/list`, data, {
    custom: { auth: true, toast: true },
  });
};
// 划转
export const _transfer = (data = {}) => {
  return http.post(`/authc/v1/account/transfer`, data, {
    custom: { auth: true, toast: true },
  });
};
// 划转记录
export const _transferLog = (data = {}) => {
  return http.post(`/authc/v1/account/transfer/log`, data, {
    custom: { auth: true, toast: true },
  });
};
// 兑换汇率
export const _swapRate = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/query`, data, {
    custom: { auth: true, toast: true },
  });
};
// 兑换
export const _converter = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/converter`, data, {
    custom: { auth: true, toast: true },
  });
};
// 借贷参数
export const _loanPara = (data = {}) => {
  return http.post(`/anon/v1/account/loan/para`, data, {
    custom: { auth: true, toast: true },
  });
};

export const memberInfo = () => { }