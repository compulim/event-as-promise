import hasResolved from './hasResolved';

test('async resolve', async () => {
  let resolve;
  const promise = new Promise(r => resolve = r);

  await expect(hasResolved(promise)).resolves.toBeFalsy();
  resolve();
  await expect(hasResolved(promise)).resolves.toBeTruthy();
});

test('sync resolve', () => {
  expect(hasResolved(Promise.resolve(123))).resolves.toBeTruthy();
});

test('async reject', async () => {
  let reject;
  const promise = new Promise((_, r) => reject = r);

  await expect(hasResolved(promise)).resolves.toBeFalsy();
  reject();
  await expect(hasResolved(promise)).resolves.toBeFalsy();
});

test('sync reject', () => {
  expect(hasResolved(Promise.reject(123))).resolves.toBeFalsy();
});
