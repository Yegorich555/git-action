interface Time {
  hours: number;
  minutes: number;
}

interface Element {
  scrollIntoViewIfNeeded?(center?: boolean): void;
}

// global fix for object keys
type ObjectKeys<T> =
  // prettier-ignore
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}

declare const DEV: boolean;
