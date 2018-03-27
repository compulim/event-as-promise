import { EventEmitter } from 'events';

import EventAsPromise from '.';
import hasResolved from 'has-resolved';

test('not backlogged', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('hello', eventAsPromise.eventListener);

  const promise = eventAsPromise.one();

  expect(await hasResolved(promise)).toBeFalsy();

  emitter.emit('hello', 'World!');

  await expect(promise).resolves.toBe('World!');
});

test('backlogged', async () => {
  const eventAsPromise = new EventAsPromise();
  const emitter = new EventEmitter();

  emitter.on('count', eventAsPromise.eventListener);
  emitter.emit('count', 1);

  const promise = eventAsPromise.one();

  emitter.emit('count', 2);

  expect(await hasResolved(promise)).toBeTruthy();

  await expect(promise).resolves.toBe(2);
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

    if (count > 1) { break; }
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
