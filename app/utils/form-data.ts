/**
 * FormDataを、指定した型のオブジェクトにして返す。
 * 第2引数で指定したキーは除外される。
 * @param form
 * @param excludeKeys
 * @returns
 */
export const getFormData = <T extends Record<string, unknown>>(
  form: FormData,
  excludeKeys?: string[],
): T => {
  const data: Partial<T> = {};

  for (const [key, value] of form.entries()) {
    // 除外キーに含まれる場合はスキップ
    if (excludeKeys && excludeKeys.includes(key)) {
      continue;
    }
    data[key as keyof T] = value as T[keyof T];
  }

  return data as T;
};
