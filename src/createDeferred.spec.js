import createDeferred from './createDeferred';
import hasRejected from './hasRejected';
import hasResolved from './hasResolved';

test('resolve', async () => {
  const deferred = createDeferred();

  await expect(hasRejected(deferred.promise)).resolves.toBeFalsy();
  await expect(hasResolved(deferred.promise)).resolves.toBeFalsy();

  deferred.resolve(123);

  await expect(deferred.promise).resolves.toBe(123);
});

test('reject', async () => {
  const deferred = createDeferred();

  await expect(hasRejected(deferred.promise)).resolves.toBeFalsy();
  await expect(hasResolved(deferred.promise)).resolves.toBeFalsy();

  deferred.reject(new Error('123'));

  await expect(deferred.promise).rejects.toThrow('123');
});

test('not compliant', async () => {
  const originalPromise = global.Promise;

  try {
    global.Promise = () => 0;

    expect(() => createDeferred()).toThrow('not a ES-compliant');
  } finally {
    global.Promise = originalPromise;
  }
});
