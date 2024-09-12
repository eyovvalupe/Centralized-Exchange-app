
// 时间转换为 yyyy-mm-dd hh:mm:ss 格式
// key==2  返回 hh:mm:ss
// key==1  返回 yyyy-mm-dd
export function getTimestr(timestamp, key) {
  if (!timestamp) return " ";
  if (isNaN(Number(timestamp))) return timestamp;
  timestamp = Number(timestamp); // 原始时间戳
  // 获取本地时区的偏移量
  const localTimeZoneOffset =
    new Date(timestamp).getTimezoneOffset() * 60 * 1000;
  // 获取目标时区的偏移量（东8区）
  const targetTimeZoneOffset = -8 * 60 * 60 * 1000;
  // 获取目标时区的时间戳
  const time = timestamp - localTimeZoneOffset + targetTimeZoneOffset;

  const currentDate = new Date(time);
  // 获取年、月、日、小时、分钟和秒
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且补0
  const day = String(currentDate.getDate()).padStart(2, "0"); // 补0
  const hours = String(currentDate.getHours()).padStart(2, "0"); // 补0
  const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // 补0
  const seconds = String(currentDate.getSeconds()).padStart(2, "0"); // 补0

  if (key == 1) return `${year}-${month}-${day}`;
  if (key == 2) return `${hours}:${minutes}:${seconds}`
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// 时间字符转换  20240622105805 ->yyyy-mm-dd hh:mm:ss
export function strTime2Str(str) {
  if (!str) return str
  // 将时间戳分割为各部分
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hour = str.slice(8, 10);
  const minute = str.slice(10, 12);
  const second = str.slice(12, 14);

  // 组合成所需的格式
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 秒 转换成  xx时xx分xx秒
export function formatSec(seconds) {
  if (seconds < 0) return '--'
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  return `${days}天${hours}时${minutes}分`;
}

// 秒 转换成 hh:mm:ss
export function formatSec2(seconds) {
  if (seconds < 0) return '--'
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60
  return `${hours}:${minutes}:${sec}`;
}