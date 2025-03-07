// 一些公共的数据配置

import i18n from "@/i18";
const { t } = i18n.global;

// 账户类型
export const _accountMap = {
  money: t('accountMap.cashAccount'),
  stock: t("accountMap.stockAccount"),
  futures: t("accountMap.contractAccount"),
  forex: t("accountMap.foreignExchangeAccount"),
};
export const _accountMapList = [
  { key: "money", value: t('assets.wallet_cash_value') },
  { key: "stock", value: t('assets.wallet_header_stock') },
  { key: "futures", value: t('assets.wallet_header_contract') },
  { key: "forex", value: t('assets.wallet_header_forex') },
];

// 借贷状态
export const _loanStatusMap = {
  open: "借贷中",
  done: "已还款",
};

// 提现状态
export const _withdrawStatusMap = {
  review: t("withdrawStatusMap.review"),
  success: t("withdrawStatusMap.success"),
  failure: t("withdrawStatusMap.failure"),
  unknown: t("withdrawStatusMap.unknown"),
};

// 提现状态
export const _topUpStatusMap = {
  review: t("topUpStatusMap.review"),
  success: t("topUpStatusMap.success"),
  failure: t("topUpStatusMap.failure"),
  unknown: t("topUpStatusMap.unknown"),
};

// 加密币种
export const _currencyMapList = ["USDT", "USD", "BTC", "ETH"];

// 加密网络
export const _networkMapList = {
  USDT: ["Trc20", "Erc20"],
  ETH: ["Ethereum"],
  BTC: ["Legacy", "SegWit"],
};

// 时间单位
export const _dateUnitMap = {
  s: t('common.second'),
  m: t('market.market_buy_optional_duaration'),
  h: t('common.hour'),
  d: t('finance.portfolio_day_multi'),
};

export const _langMap = [
  { name: "中文简体", icon: "zh", val: "zh", show: true },
  { name: "中文繁體", icon: "ch", val: "ch", show: true },
  { name: "English", icon: "en", val: "en", show: true },
  { name: "한국어", icon: "kr", val: "kr", show: true},
  { name: "日本語", icon: "jp", val: "jp", show: true},
  // { name: "Deutsch", icon: "de", val: "de", show: true},

];

export const fiat = ['INR', 'USD']