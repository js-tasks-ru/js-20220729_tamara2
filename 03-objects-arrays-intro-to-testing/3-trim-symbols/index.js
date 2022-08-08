/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let count = 0;
  let currentElem = string[0];
  let result = '';
  if (size === undefined) {
    return string;
  }
  for (let i = 0; i < string.length; i++) {
    if (currentElem === string[i]) {
      count += 1;
    } else {
      count = 1;
    }
    if (count <= size) {
      result += string[i];
    }
    currentElem = string[i];
  }
  return result;
}
