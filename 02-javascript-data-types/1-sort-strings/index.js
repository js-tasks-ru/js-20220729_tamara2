function compare(str1, str2) {
  return str1.localeCompare(str2, [], {caseFirst: 'upper'});
}

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => param === 'asc' ? compare(a, b) : compare(b, a))
}
