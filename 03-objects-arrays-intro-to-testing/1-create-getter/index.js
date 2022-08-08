/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const [first, ...rest] = path.split('.');
  return (obj) => {
    const firstElem = obj[first];
    if (!rest.length) {
      return firstElem;
    }
    if (!obj[first]) {
      return undefined;
    }
    return createGetter(rest.join('.'))(firstElem);
  };
}
