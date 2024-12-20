/**
 * FormDataを、指定した型のオブジェクトにして返す。
 * オプションで指定したキーを含める、または除外することが可能。
 * @param form
 * @param options
 * @returns
 */
export const parseFormData = <T extends Record<string, unknown>>(
  form: FormData,
  options?: {
    includeKeys?: string[];
    excludeKeys?: string[];
  },
): T => {
  const data: Partial<T> = {};
  const { includeKeys, excludeKeys } = options || {};

  for (const [key, value] of form.entries()) {
    // `includeKeys` が指定されている場合は、その中に含まれるキーのみ処理
    if (includeKeys && !includeKeys.includes(key)) {
      continue;
    }

    // `excludeKeys` が指定されている場合は、その中に含まれるキーをスキップ
    if (excludeKeys && excludeKeys.includes(key)) {
      continue;
    }

    // データを追加
    data[key as keyof T] = value as T[keyof T];
  }

  return data as T;
};
