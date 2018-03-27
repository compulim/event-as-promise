export default function hasRejected(promise) {
  const symbol = Symbol();

  return Promise.race([
    promise,
    new Promise((resolve, reject) => setImmediate(() => reject(symbol)))
  ]).then(() => false, result => result !== symbol);
}
