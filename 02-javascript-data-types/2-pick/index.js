/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const filtered = Object.keys(obj).filter(val => fields.includes(val));
  return filtered.reduce((acc, key) => ({...acc, [key]: obj[key]}), {});
};
