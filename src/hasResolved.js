export default function hasResolved(promise) {
  const symbol = Symbol();

  return Promise.race([
    promise,
    new Promise((resolve, reject) => setImmediate(() => resolve(symbol)))
  ]).then(result => result !== symbol, () => false);
}
