
// 时间转换为 yyyy-mm-dd hh:mm:ss 格式
export function getTimestr(timestamp) {
  if (!timestamp) return "";
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
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
