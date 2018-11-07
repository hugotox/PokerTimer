export function intComma(value) {
  value = String(value);
  let reversedArr = value.split("").reverse();
  let count = 0;
  let newVal = [];
  for (let i = 0; i < reversedArr.length; i++) {
    if (count === 3) {
      newVal.unshift(",");
      count = 0;
    }
    count++;
    newVal.unshift(reversedArr[i]);
  }
  return newVal.join("");
}
