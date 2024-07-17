export function flushAllPromises (): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}
