export function transformClassName(className = '') {
  return className.replace(/(\r\n|\n|\r)/gm, ' ').replace(/ +/g, ' ').trim();
}

export function lookUpObjectValue(obj = {}, exp = '', isDate = false) {
  const result = exp.split('.').reduce((old, curr) => old[curr], obj);
  if (isDate) return new Date(result);
  return result;
}

export function getFormattedDate(date) {
  const _date = new Date(date);
  let day = (_date.getDate());
  let month = (_date.getMonth() + 1);
  const year = (_date.getFullYear());

  if (day < 10) day = `0${day}`;
  if (month < 10) month = `0${month}`;

  return `${day}/${month}/${year}`;
}