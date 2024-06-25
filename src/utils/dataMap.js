// 一些公共的数据配置


// 账户类型
export const _accountMap = {
  "money": "现金账户",
  "stock": "股票账户",
  "contract": "合约账户",
};
export const _accountMapList = [
  { key: "money", value: "现金账户" },
  { key: "stock", value: "股票账户" },
  { key: "contract", value: "合约账户" },
]


// 借贷状态
export const _loanStatusMap = {
  "open": "借贷中",
  "done": "已还款"
}

// 提现状态
export const _withdrawStatusMap = {
  "review": "审核中",
  "success": "成功",
  "failed": "失败"
}