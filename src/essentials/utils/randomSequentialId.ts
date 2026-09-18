let counter = 0;

export const getSequantialRandomId = (prefix = 'id') =>
  `${prefix}-${Math.round(Math.random() * 1000).toString(36)}-${Date.now().toString(36)}-${(counter++).toString(36)}`;
