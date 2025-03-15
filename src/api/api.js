import http from "./request";
import axios from "axios";
import { BASE_ADDRESS } from "@/config"

// const baseURL = process.env.NODE_ENV === 'development' ? "/api" : BASE_ADDRESS
const baseURL = BASE_ADDRESS
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
  return axios.get(baseURL + "/anon/v1/comm/verifcode?t=" + Date.now(), { responseType: 'blob' }, {
    custom: { auth: false, toast: false, retry: true },
  })
};

// 登录
export const _login = (data = {}) => {
  return http.post(`/anon/v1/user/login`, data, {
    custom: { auth: false, toast: false, retry: false },
  });
};
// 退出登录
export const _logout = (data = {}) => {
  return http.post(`/authc/v1/user/logout`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};

// 获取用户信息
export const _userinfo = (data = {}) => {
  return http.post(`/authc/v1/user/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 谷歌验证器状态
export const _google = (data = {}) => {
  return http.post(`/authc/v1/user/google/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 绑定谷歌验证器
export const _googleBind = (data = {}) => {
  return http.post(`/authc/v1/user/google/bind`, data, {
    custom: { auth: true, toast: false, retry: false },
  });
};

// 自选列表
export const _watchlist = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

// 搜索股票
export const _search = (data = {}) => {
  return http.post(`/anon/v1/item/search`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取股票基本信息
export const _basic = (data = {}) => {
  return http.post(`/anon/v1/item/basic`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取股票详情
export const _profile = (data = {}) => {
  return http.post(`/anon/v1/item/stock/profile`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 股票搜索
export const _stock = (data = {}) => {
  return http.post(`/anon/v1/item/stock `, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取 K 线历史数据
export const _kline = (data = {}) => {
  return http.get(`/anon/v1/ticker/kline?symbol=${data.symbol}&period=${data.period}&page=${data.page}`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取分时图历史数据
export const _time = (data = {}) => {
  return http.get(`/anon/v1/ticker/time?symbol=${data.symbol}`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取市场排序数据
export const _sort = (data = {}) => {
  return http.post(`/anon/v1/market/rankinglist`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 获取市场信息
export const _marketGet = (data = {}) => {
  return http.post(`/anon/v1/market/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 订单列表
export const _stocksList = (data = {}) => {
  return http.post(`/authc/v1/stock/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  })
};

// 添加自选
export const _add = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/add`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//交易参数
export const _stocksPara = (data = {}) => {
  return http.post(`/anon/v1/stock/para`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 移除自选
export const _del = (data = {}) => {
  return http.post(`/authc/v1/item/watchlist/del`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//钱包余额
export const _walletBalance = (data = {}) => {
  return http.post(`authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
}

// 修改密码
export const _updatepw = (data = {}) => {
  return http.post(`/authc/v1/user/password`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 修改交易密码
export const _safeword = (data = {}) => {
  return http.post(`/authc/v1/user/safeword`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//开仓
export const _stocksBuy = (data = {}) => {
  return http.post(`/authc/v1/stock/buy`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//SessionToken
export const _commToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 忘记密码
export const _forgetpw = (data = {}) => {
  return http.post(`/anon/v1/user/forget`, data, {
    custom: { auth: false, toast: true, retry: false },
  });
};

//订单详情
export const _stocksGet = (data = {}) => {
  return http.post(`authc/v1/stock/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

//平仓
export const _stocksSell = (data = {}) => {
  return http.post(`authc/v1/stock/sell`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// KYC 状态查询
export const _kycGet = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// KYC L1 提交
export const _kyc1 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l1/set`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// KYC L2 提交
export const _kyc2 = (data = {}) => {
  return http.post(`/authc/v1/user/kyc/l2/set`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// SessionToken
export const _sessionToken = (data = {}) => {
  return http.post(`/anon/v1/comm/token`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 用户注册
export const _register = (data = {}) => {
  return http.post(`/anon/v1/user/register`, data, {
    custom: { auth: false, toast: false, retry: false },
  });
};
// 模拟注册
export const _guestRegister = (data = {}) => {
  return http.post(`/anon/v1/user/guest/register`, data, {
    custom: { auth: false, toast: false, retry: false },
  });
};
// 新闻列表
export const _news = (data = {}) => {
  return http.post(`/anon/v1/market/news`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};

// 新增支付方式 
export const _addAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/add`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//删除支付方式
export const _delAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/del`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 收款账户列表 
export const _listAccount = (data = {}) => {
  return http.post(`/authc/v1/withdraw/account/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

// 订单更新
export const _stocksUpdate = (data = {}) => {
  return http.post(`/authc/v1/stock/update`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 撤销订单
export const _stocksCancel = (data = {}) => {
  return http.post(`/authc/v1/stock/cancel`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};


// 总资产
export const _assets = (data = {}) => {
  return http.post(`/authc/v1/account/assets`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 现金账户
export const _balance = (data = {}) => {
  return http.post(`/authc/v1/wallet/balance`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值记录
export const _depositList = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 划转
export const _transfer = (data = {}) => {
  return http.post(`/authc/v1/account/transfer`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 划转记录
export const _transferLog = (data = {}) => {
  return http.post(`/authc/v1/account/transfer/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 兑换汇率
export const _swapRate = (data = {}) => {
  return http.post(`/anon/v1/wallet/swap/query`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 兑换
export const _converter = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/converter`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 兑换记录
export const _converterLog = (data = {}) => {
  return http.post(`/authc/v1/wallet/swap/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 借贷参数
export const _loanPara = (data = {}) => {
  return http.post(`/anon/v1/account/loan/config`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 借贷手续费
export const _loanRate = (data = {}) => {
  return http.post(`/anon/v1/account/loan/config/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 借贷
export const _loan = (data = {}) => {
  return http.post(`/authc/v1/account/loan`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 借贷记录
export const _loanLog = (data = {}) => {
  return http.post(`/authc/v1/account/loan/log`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// IPO 列表
export const _ipoList = (data = {}) => {
  return http.post(`/anon/v1/ipo/list`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// IPO 记录详情
export const _ipoGet = (data = {}) => {
  return http.post(`/anon/v1/ipo/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 认购参数
export const _orderPara = (data = {}) => {
  return http.post(`/anon/v1/ipo/order/para`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 认购
export const _orderBuy = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/buy`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 我的订单
export const _orderList = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 订单详情
export const _orderGet = (data = {}) => {
  return http.post(`/authc/v1/ipo/order/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 提现手续费
export const _withdrawFee = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw/fee`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 提现
export const _withdraw = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// 提现查询
export const _withdrawGet = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw/get`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

// 提现记录
export const _withdrawList = (data = {}) => {
  return http.post(`/authc/v1/wallet/withdraw/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 获取充值 币种
export const _cryptoCoin = (data = {}) => {
  return http.post(`/anon/v1/wallet/currency`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 现金账户支持的货币 (已弃用)
export const _currency = (data = {}) => {
  return http.post(`/authc/v1/account/balance`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 其他账户支持的货币 (已弃用)
export const accountCurrency = (data = {}) => {
  return http.post(`/anon/v1/account/currency`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 获取充值地址
export const _paycode = (data = {}) => {
  return http.post(`/authc/v1/wallet/crypto/paycode`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值1
export const _deposit1 = (data = {}) => {
  return http.post(`/authc/v1/wallet/crypto/deposit`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 查询/刷新超时
export const _depositGet = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 充值
export const _deposit = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 充值单详情
export const _depositInfo = (data = {}) => {
  return http.post(`/authc/v1/wallet/deposit/get`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 自选推荐
export const _watchlistDefault = (data = {}) => {
  return http.post(`/anon/v1/item/watchlist/default`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 正在充值和提现的订单笔数
export const _accountHint = (data = {}) => {
  return http.post(`/authc/v1/account/hint`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 市场总览
export const _marketOverview = (data = {}) => {
  return http.post(`/anon/v1/market/overview`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 股票交易所支持列表
export const _exchange = (data = {}) => {
  return http.post(`/anon/v1/market/stock/exchange`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 股票推荐列表
export const _recommend = (data = {}) => {
  return http.post(`anon/v1/market/stock/recommend`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 账号检测
export const _userExist = (data = {}) => {
  return http.post(`/anon/v1/user/exist`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 现货列表
export const _trade = (data = {}) => {
  return http.post(`/anon/v1/item/trade`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 合约列表
export const _futures = (data = {}) => {
  return http.post(`/anon/v1/item/futures`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 合约参数
export const _futuresPara = (data = {}) => {
  return http.post(`/anon/v1/futures/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 现货参数
export const _spotPara = (data = {}) => {
  return http.post(`/anon/v1/trade/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 订单列表
export const _futuresList = (data = {}) => {
  return http.post(`/authc/v1/futures/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 现货-订单列表
export const _spotList = (data = {}) => {
  return http.post(`/authc/v1/trade/orders`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

// 合约开仓
export const _futuresBuy = (data = {}) => {
  return http.post(`/authc/v1/futures/buy`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 现货开仓
export const _spotBuy = (data = {}) => {
  return http.post(`/authc/v1/trade/buysell`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 合约平仓
export const _futuresSell = (data = {}) => {
  return http.post(`/authc/v1/futures/sell`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约撤单
export const _futuresCancel = (data = {}) => {
  return http.post(`/authc/v1/futures/cancel`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 现货撤单
export const _spotCancel = (data = {}) => {
  return http.post(`/authc/v1/trade/cancel`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 合约更新
export const _futuresUpdate = (data = {}) => {
  return http.post(`/authc/v1/futures/update`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// ai列表
export const _aiquant = (data = {}) => {
  return http.post(`/anon/v1/item/aiquant`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// ai列表2.0
export const _aiquant2 = (data = {}) => {
  return http.post(`/anon/v2/item/aiquant`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// ai交易参数
export const _aipara = (data = {}) => {
  return http.post(`/anon/v1/aiquant/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// ai开仓
export const _aibuy = (data = {}) => {
  return http.post(`/authc/v1/aiquant/buy`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 订单列表
export const _ailist = (data = {}) => {
  return http.post(`/authc/v1/aiquant/list`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 订单详情
export const _aiget = (data = {}) => {
  return http.post(`/authc/v1/aiquant/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 快捷买入或卖出
export const _orderFast = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/fast`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// 自选列表
export const _adList = (data = {}) => {
  return http.post(`/anon/v1/c2c/ad/list`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 自选交易
export const _buysell = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/buysell`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// c2c订单详情
export const _c2cOrderInfo = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/get`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// c2c订单设置状态
export const _c2cOrderStatus = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/status`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};
// c2c历史订单
export const _c2cOrderList = (data = {}) => {
  return http.post(`/authc/v1/c2c/order/list`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// c2c已读回执
export const _c2cRead = (data = {}) => {
  return http.post(`/authc/v1/c2c/msg/read`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 大宗交易参数
export const _blocktradePara = (data = {}) => {
  return http.post(`/roles/v1/blocktrade/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 大宗交易订单列表
export const _blocktradeList = (data = {}) => {
  return http.post(`/roles/v1/blocktrade/q/list`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 大宗交易订单平仓
export const _blocktradeSell = (data = {}) => {
  return http.post(`/roles/v1/blocktrade/m/sell`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

//质押挖矿
export const _miningList = (data = {}) => {
  return http.post(`/anon/v1/mining/list`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
export const memberInfo = () => { }

//借币参数
export const _pledgePara = (data = {}) => {
  return http.post(`/anon/v1/pledge/para`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};

//借币
export const _pledgeApply = (data = {}) => {
  return http.post(`/authc/v1/pledge/apply`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

//我的借币订单
export const _pledgeOrders = (data = {}) => {
  return http.post(`/authc/v1/pledge/orders`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};

//借币还款
export const _pledgeRepay = (data = {}) => {
  return http.post(`/authc/v1/pledge/repay`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};

// 跟单列表
export const _copyList = (data = {}) => {
  return http.post(`/anon/v1/copy/list`, data, {
    custom: { auth: false, toast: false, retry: true },
  });
};
// 我的跟单列表
export const _copyMyList = (data = {}) => {
  return http.post(`/authc/v1/copy/mycopy`, data, {
    custom: { auth: true, toast: false, retry: true },
  });
};
// 取消跟单
export const _copyCancel = (data = {}) => {
  return http.post(`/authc/v1/copy/cancel`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 跟单
export const _copyApply = (data = {}) => {
  return http.post(`/authc/v1/copy/apply `, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 追加跟单
export const _copyAdd = (data = {}) => {
  return http.post(`/authc/v1/copy/add`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 我的跟单数据
export const _copyMyData = (data = {}) => {
  return http.post(`/authc/v1/copy/mycopydata`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};
// 跟单详情 
export const _copyGet = (data = {}) => {
  return http.post(`/anon/v1/copy/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 跟单详情-带单 
export const _copyOrders = (data = {}) => {
  return http.post(`/anon/v1/copy/orders`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
// 跟单详情-跟单用户 
export const _copyUsers = (data = {}) => {
  return http.post(`/anon/v1/copy/users`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
//实时数据
export const _realtime = (data = {}) => {
  const urlSeachParam = new URLSearchParams(data).toString();
  return http.get(`anon/v1/ticker/realtime?${urlSeachParam}`, {
    custom: { auth: false, toast: true, retry: false }
  })
}
// 质押挖矿详情 
export const _stakeGet = (data = {}) => {
  return http.post(`/anon/v1/mining/get`, data, {
    custom: { auth: false, toast: true, retry: true },
  });
};
//申购
export const _stake = (data = {}) => {
  return http.post(`/authc/v1/mining/apply`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

//我的投资订单
export const _stakeOrder = (data = {}) => {
  return http.post(`/authc/v1/mining/orders`, data, {
    custom: { auth: true, toast: true, retry: false },
  });
};

//我的收益
export const _myEarn = (data = {}) => {
  return http.post(`/authc/v1/mining/earn`, data, {
    custom: { auth: true, toast: true, retry: true },
  });
};

//公告弹窗
export const _notifiPopup = (data = {}) => {
  return http.post(`/authc/v1/notice/popup`, data, {
    custom: { auth: true, toast: true, retry: true }
  })
}

//公告列表
export const _notifiList = (data = {}) => {
  return http.post(`/anon/v1/notice/list`, data, {
    custom: { auth: false, toast: true, retry: true }
  })
}

//公告详情
export const _notifiDetail = (data = {}) => {
  return http.post(`/anon/v1/notice/get`, data, {
    custom: { auth: false, toast: true, retry: true }
  })
}
//加入活动列表
export const _notifiJoinList = (data = {}) => {
  return http.post(`/authc/v1/notice/joinlist`, data, {
    custom: { auth: true, toast: true, retry: true }
  })
}

//加入活动
export const _notifiJoin = (data = {}) => {
  return http.post(`/authc/v1/notice/join`, data, {
    custom: { auth: true, toast: true, retry: true }
  })
}

//推荐数据
export const _referralData = (data = {}) => {
  return http.post(`/authc/v1/user/referral/total`, data, {
    custom: { auth: true, toast: true, retry: true }
  })
}

//推荐用户
export const _referralUsers = (data = {}) => {
  return http.post(`/authc/v1/user/referral/myusers`, data, {
    custom: { auth: true, toast: true, retry: true }
  })
}