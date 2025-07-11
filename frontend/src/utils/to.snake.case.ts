export function toSnakeCase(object: unknown): unknown {
  if (Array.isArray(object)) {
    return object.map(toSnakeCase);
  } else if (object !== null && typeof object === 'object') {
    return Object.fromEntries(
      Object.entries(object).map(([key, value]) => [
        key.replace(/([A-Z])/g, '_$1').toLowerCase(),
        toSnakeCase(value),
      ]),
    );
  }
  return object;
}
