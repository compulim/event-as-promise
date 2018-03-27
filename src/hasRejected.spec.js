import hasRejected from './hasRejected';

test('async resolve', async () => {
  let resolve;
  const promise = new Promise(r => resolve = r);

  await expect(hasRejected(promise)).resolves.toBeFalsy();
  resolve();
  await expect(hasRejected(promise)).resolves.toBeFalsy();
});

test('sync resolve', () => {
  expect(hasRejected(Promise.resolve(123))).resolves.toBeFalsy();
});

test('async reject', async () => {
  let reject;
  const promise = new Promise((_, r) => reject = r);

  await expect(hasRejected(promise)).resolves.toBeFalsy();
  reject();
  await expect(hasRejected(promise)).resolves.toBeTruthy();
});

test('sync reject', () => {
  expect(hasRejected(Promise.reject(123))).resolves.toBeTruthy();
});
