export default function hasRejected(promise) {
  const symbol = Symbol();

  return Promise.race([
    promise,
    new Promise((resolve, reject) => setTimeout(() => reject(symbol)))
  ]).then(() => false, result => result !== symbol);
}
