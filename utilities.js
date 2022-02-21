export const cammelToDash = (str) => {
  return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
};
