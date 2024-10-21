/**
 * 日付を文字列に変換する。
 * @param date
 * @param sep e.g. "/"
 * @returns
 */
export const formatDate = (date: Date, sep = '') => {
  const yyyy = date.getFullYear();
  const mm = ('00' + (date.getMonth() + 1)).slice(-2);
  const dd = ('00' + date.getDate()).slice(-2);

  return `${yyyy}${sep}${mm}${sep}${dd}`;
};

/**
 * Checks if the given date string is a valid date.
 * @param dateString The date string to validate, e.g. "2022-01-01"
 * @returns true if the date string is valid, false otherwise
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
