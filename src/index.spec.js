import { EventEmitter } from 'events';

import EventAsPromise from '.';
import hasResolved from 'has-resolved';

test('one', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('hello', eventAsPromise.eventListener);

  const promise = eventAsPromise.one();

  await expect(hasResolved(promise)).resolves.toBeFalsy();

  emitter.emit('hello', 'World!');

  await expect(promise).resolves.toBe('World!');
});

test('no backlog', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);
  emitter.emit('count', 1);

  const onePromise = eventAsPromise.one();
  const upcomingPromise = eventAsPromise.upcoming();

  emitter.emit('count', 2);

  await expect(hasResolved(onePromise)).resolves.toBeTruthy();
  await expect(onePromise).resolves.toBe(2);

  await expect(hasResolved(upcomingPromise)).resolves.toBeTruthy();
  await expect(upcomingPromise).resolves.toBe(2);
});

test('repeated', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);

  const promise1 = eventAsPromise.one();
  emitter.emit('count', 'one');

  const promise2 = eventAsPromise.one();
  emitter.emit('count', 'two');

  const promise3 = eventAsPromise.one();

  await expect(promise1).resolves.toBe('one');
  await expect(promise2).resolves.toBe('two');
  expect(await hasResolved(promise3)).toBeFalsy();
});

test('repeated backlog', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);

  const promise1 = eventAsPromise.one();
  const promise2 = eventAsPromise.one();
  const promise3 = eventAsPromise.one();

  emitter.emit('count', 'one');
  emitter.emit('count', 'two');

  await expect(promise1).resolves.toBe('one');
  await expect(promise2).resolves.toBe('two');
  expect(await hasResolved(promise3)).toBeFalsy();
});

test('using as iterator', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);

  let count = 0;

  for (let promise of eventAsPromise) {
    emitter.emit('count', count);
    await expect(promise).resolves.toBe(count);
    count++;

    // Obtaining a future inside for-loop should not affect the for-loop
    // We specifically don't emit for this future to make sure it don't affect the for-loop
    eventAsPromise.one();

    if (count > 10) { break; }
  }
});

test('multiple args', async () => {
  const eventAsPromise = new EventAsPromise({ array: true });
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);

  const promise = eventAsPromise.one();

  emitter.emit('count', 'one', 'two');

  await expect(promise).resolves.toEqual(['one', 'two']);
});

test('upcoming', async () => {
  const emitter = new EventEmitter();
  const countPromises = new EventAsPromise();

  emitter.on('count', countPromises.eventListener);

  const promiseOne1 = countPromises.upcoming();
  const promiseOne2 = countPromises.upcoming.call(null);
  const promiseOne3 = countPromises.one();
  const promiseTwo = countPromises.one.call(null);

  emitter.emit('count', 'one');
  emitter.emit('count', 'two');

  await expect(promiseOne1).resolves.toBe('one');
  await expect(promiseOne2).resolves.toBe('one');
  await expect(promiseOne3).resolves.toBe('one');
  await expect(promiseTwo).resolves.toBe('two');

  const promiseThree = countPromises.upcoming();

  emitter.emit('count', 'three');

  await expect(promiseOne1).resolves.toBe('one');
  await expect(promiseThree).resolves.toBe('three');
});
