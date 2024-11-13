// 一些公共的数据配置

import i18n from '@/i18'
const { t } = i18n.global

// 账户类型
export const _accountMap = {
  "money": t('accountMap.cashAccount'),
  "stock": t('accountMap.stockAccount'),
  "futures": t('accountMap.contractAccount'),
  "forex": t('accountMap.foreignExchangeAccount'),
};
export const _accountMapList = [
  { key: "money", value: "现金账户" },
  { key: "stock", value: "股票账户" },
  { key: "futures", value: "合约账户" },
  { key: "forex", value: "外汇账户" },
]


// 借贷状态
export const _loanStatusMap = {
  "open": "借贷中",
  "done": "已还款"
}

// 提现状态
export const _withdrawStatusMap = {
  "review": t('withdrawStatusMap.review'),
  "success": t('withdrawStatusMap.success'),
  "failure": t('withdrawStatusMap.failure'),
  "unknown": t('withdrawStatusMap.unknown')
}

// 提现状态
export const _topUpStatusMap = {
  "review": t('topUpStatusMap.review'),
  "success": t('topUpStatusMap.success'),
  "failure": t('topUpStatusMap.failure'),
  "unknown": t('topUpStatusMap.unknown')
}

// 加密币种
export const _currencyMapList = ['USDT', 'USD', 'BTC', 'ETH']

// 加密网络
export const _networkMapList = {
  USDT: ['Trc20', 'Erc20'],
  ETH: ['Ethereum'],
  BTC: ['Legacy', 'SegWit']
}


// 时间单位
export const _dateUnitMap = {
  s: 's',
  m: 'min',
  h: 'h',
  d: 'day'
}