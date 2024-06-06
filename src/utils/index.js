// 常用工具类

// 转换数字显示  带单位(K,M,B)
export const _formatNumber = (num, tail = 2) => {
  if (isNaN(num)) return ''
  num = Number(num)
  if (num >= 1.0e+9) {
    return (num / 1.0e+9).toFixed(tail) + "B";
  } else if (num >= 1.0e+6) {
    return (num / 1.0e+6).toFixed(tail) + "M";
  } else if (num >= 1.0e+3) {
    return (num / 1.0e+3).toFixed(tail) + "K";
  } else {
    return num.toFixed(tail);
  }
}

// 复制
export const _copyTxt = (txt) => {
  txt += "";
  if (txt == "null" || txt == "undefined" || txt == "") {
    return;
  }
  if (document.queryCommandSupported("copy")) {
    let textarea = document.createElement("textarea");
    textarea.value = txt;
    textarea.readOnly = "readOnly";
    document.body.appendChild(textarea);
    textarea.select(); // 选中文本内容
    textarea.setSelectionRange(0, txt.length);
    document.execCommand("copy");
    textarea.remove();
  }
};


// 精度计算
export const _jia = (arg1, arg2) => {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};
export const _jian = (arg2, arg1) => {
  let r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  n = r1 >= r2 ? r1 : r2;
  return ((arg2 * m - arg1 * m) / m).toFixed(n);
};
export const _cheng = (arg1, arg2) => {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch { }
  try {
    m += s2.split(".")[1].length;
  } catch { }
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
};
export const _chu = (arg1, arg2) => {
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch { }
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch { }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};



// 隐藏手机号
export const _hiddenPhone = (str) => {
  if (!str) return "**";
  return str.substr(0, 3) + "****" + str.substr(str.length - 3, 3);
};
// 隐藏邮箱
export const _hiddenEmail = (str) => {
  if (!str) return "**";
  return str.substr(0, 1) + "****" + str.split("@")[1];
};
// 隐藏身份证
export const _hiddenIden = (str) => {
  if (!str) return "**";
  return str.substr(0, 4) + "****" + str.substr(str.length - 4, 4);
};
// 隐藏账号
export const _hiddenAccount = (str) => {
  if (!str) return "**";
  if (str.length > 8) {
    return str.substr(0, 3) + "****" + str.substr(str.length - 3, 3);
  }
  return str.substr(0, 2) + "****" + str.substr(str.length - 2, 2);
};
// 隐藏名字
export const _hiddenName = (str) => {
  if (!str) return "**";
  if (str.length > 2) {
    return str.substr(0, 1) + "*" + str.substr(str.length - 1, 1);
  }
  return str.substr(0, 1) + "*";
};


// 文件转url展示
export const _getObjectURL = (file) => {
  let url = file
  if (window.createObjectURL != undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

// 播放提示音
export const _voice = (type = 1) => {

}