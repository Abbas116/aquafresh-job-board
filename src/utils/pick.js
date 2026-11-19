// Keep only allowed fields from the request body (blocks unexpected/malicious fields)
module.exports = (obj, keys) =>
  keys.reduce((acc, k) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) acc[k] = obj[k];
    return acc;
  }, {});
