import { describe, expect, it } from 'vitest';
import { getFormData } from './form-data';

describe('getFormData', () => {
  it('should convert FormData to a typed object', () => {
    // Arrange
    const form = new FormData();
    form.append('name', 'John Doe');
    form.append('email', 'john.doe@example.com');
    form.append('age', '30');

    type FormDataType = {
      name: string;
      email: string;
      age: string;
    };

    // Act
    const result = getFormData<FormDataType>(form);

    // Assert
    expect(result).toEqual({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: '30',
    });
  });

  it('should handle empty FormData', () => {
    // Arrange
    const form = new FormData();

    type FormDataType = {
      name: string;
      email: string;
    };

    // Act
    const result = getFormData<FormDataType>(form);

    // Assert
    expect(result).toEqual({});
  });

  it('should handle FormData with non-string values', () => {
    // Arrange
    const form = new FormData();
    form.append('name', 'Jane Doe');
    form.append('file', new Blob(['file content'], { type: 'text/plain' }));

    type FormDataType = {
      name: string;
      file: Blob;
    };

    // Act
    const result = getFormData<FormDataType>(form);

    // Assert
    expect(result.name).toBe('Jane Doe');
    expect(result.file).toBeInstanceOf(Blob);
  });

  it('should ignore keys not in the specified type', () => {
    // Arrange
    const form = new FormData();
    form.append('name', 'John Doe');
    form.append('extraKey', 'extraValue');

    type FormDataType = {
      name: string;
    };

    // Act
    const result = getFormData<FormDataType>(form, ['extraKey']);

    // Assert
    expect(result).toEqual({
      name: 'John Doe',
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any).extraKey).toBeUndefined(); // Extra key should not exist
  });
});
