/**
 * FormDataを、指定した型のオブジェクトにして返す。
 * @param form
 * @returns
 */
export const getFormData = <T extends Record<string, unknown>>(form: FormData): T => {
  const data: Partial<T> = {};

  for (const [key, value] of form.entries()) {
    data[key as keyof T] = value as T[keyof T];
  }

  return data as T;
};
