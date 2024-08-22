
export function removeTrailingZeros(numberString){
    // 将字符串转换为数字
  const number = parseFloat(numberString);
  // 将数字转换为字符串，并去掉多余的零
  const trimmedString = number.toString();
  return trimmedString;
}




export function removeTrailingZeros2(numberString,decimals:number){
  let balance=parseFloat(numberString);
  const formattedNum = balance.toFixed(decimals); 
  const showBalance = formattedNum.replace(/\.?0+$/, ''); 
  return showBalance;
}

