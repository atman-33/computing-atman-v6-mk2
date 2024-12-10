export abstract class ValueObject<T, U> {
  // NOTE:
  // TypeScriptは構造的型付けを採用しているため、内部構造（プロパティ、メソッド）が同じ場合は同様と見なされる。
  // そのため、_typeのような専用プロパティを追加して異なる型として認識させるようにしている。
  private _type!: U;
  protected readonly _value: T;

  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  protected abstract validate(value: T): void;

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T, U>): boolean {
    return this._value === other._value;
  }

  get isSet(): boolean {
    return this.value !== null;
  }
}
