export function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});
}

export function unflattenObject(flatObj) {
    const result = {};
    for (const key in flatObj) {
        const keys = key.split('.');
        keys.reduce((acc, part, index) => {
            if (index === keys.length - 1) {
                acc[part] = flatObj[key];
                return;
            }
            acc[part] = acc[part] || {};
            return acc[part];
        }, result);
    }
    return result;
}