
export function removeTrailingZeros(numberString){
    // 将字符串转换为数字
  const number = parseFloat(numberString);
  // 将数字转换为字符串，并去掉多余的零
  const trimmedString = number.toString();
  return trimmedString;
}