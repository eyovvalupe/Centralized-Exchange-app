// 常用工具类

// 压缩图片
export const _compressImg = (base64, multiple, fn) => { // , useImg, targetObj
  // 第一个参数就是需要加密的base65，
  // 第二个是压缩系数 0-1，
  // 第三个压缩后的回调 用来获取处理后的 base64
  if (!base64) {
    return
  }
  // const _this = this
  const length = base64.length / 1024
  // 压缩方法
  let newImage = new Image()
  let quality = 0.6    // 压缩系数0-1之间
  newImage.src = base64
  newImage.setAttribute('crossOrigin', 'Anonymous') // url为外域时需要
  let imgWidth,
    imgHeight
  let w = undefined
  newImage.onload = function () {
    // 这里面的 this 指向 newImage
    // 通过改变图片宽高来实现压缩
    w = this.width * multiple
    imgWidth = this.width
    imgHeight = this.height
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w
        // 等比例缩小
        canvas.height = w * (imgHeight / imgWidth)
      } else {
        canvas.height = w
        // 等比例缩小
        canvas.width = w * (imgWidth / imgHeight)
      }
    } else {
      canvas.width = imgWidth
      canvas.height = imgHeight
      // quality 设置转换为base64编码后图片的质量，取值范围为0-1  没什么压缩效果
      // 还是得通过设置 canvas 的宽高来压缩
      quality = 0.6
    }
    const size = Math.floor(base64.length / 1024)
    if (size < 50) {
      quality = 0.9
    } else if (size < 150) {
      quality = 0.8
    } else {

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height) //  // 这里面的 this 指向 newImage
    let smallBase64 = canvas.toDataURL('image/jpeg', quality) // 压缩语句
    // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
    // while (smallBase64.length / 1024 > 150) {
    // quality -= 0.01;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }
    // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
    // while (smallBase64.length / 1024 < 50) {
    // quality += 0.001;
    // smallBase64 = canvas.toDataURL("image/jpeg", quality);
    // }

    // 必须通过回调函数返回，否则无法及时拿到该值，回调函数异步执行
    // console.log(`压缩前：${length}KB`)
    // console.log(`压缩后：${smallBase64.length / 1024} KB`)
    fn(smallBase64)
    // return smallBase64
    // useImg(smallBase64, targetObj)
  }
}


// 转换为缩略图
export const _getSnapshotLine = (data) => {
  let str = ''
  const w = 69
  const h = 25
  let min = null
  let max = null
  data.map((item, index) => {
    if (min === null) {
      min = item.price
    }
    if (max === null) {
      max = item.price
    }
    if (item.price < min) {
      min = item.price
    }
    if (item.price > max) {
      max = item.price
    }
    str += `${index},${item.price} `
  })
  let _str = '' // 最终字符串
  const gap = max - min || min // 最大与最小值的间隙
  str.split(' ').map(item => {
    const _item = item.split(',')
    if (item.length) {
      _str += `${((_item[0] / 1) * (w / data.length)).toFixed(2)},${((_item[1] / 1 - min) * (h / gap)).toFixed(2)} `
    }
  })
  return _str.substring(0, _str.length - 1)
}


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
export function generateUUID() {
  // 生成一个32字符的UUID字符串，没有连字符
  return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
// 隐藏账号
export const _hiddenAccount = (str) => {
  if (!str) return "**";
  if (str.length > 8) {
    return str.substr(0, 3) + "***" + str.substr(str.length - 3, 3);
  }
  return str.substr(0, 2) + "***" + str.substr(str.length - 2, 2);
};
// 隐藏名字
export const _hiddenName = (str) => {
  if (!str) return "**";
  if (str.length > 2) {
    return str.substr(0, 1) + "*" + str.substr(str.length - 1, 1);
  }
  return str.substr(0, 1) + "*";
};
// 随机文件名
export function randomFileName(originalName) {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomNum}.${extension}`;
}

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

export function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomStringWithTimestamp(length) {
  const randomString = generateRandomString(length);
  const timestamp = Date.now();
  return `${randomString}${timestamp}`;
}
// 时间转换
export const transferTime = (time) => {
  const date = new Date(time);
  const currentDate = new Date();
  const isToday = date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  if (isToday) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }
}
