import { EventEmitter } from 'events';

import { EventAsPromise } from './index';

async function hasResolved(promise: Promise<unknown>): Promise<boolean> {
  return Promise.race([promise.then(() => true), new Promise<false>(resolve => setTimeout(() => resolve(false), 0))]);
}

describe.each([['dom'], ['node']])('%s event mechanism', type => {
  let eventAsPromise: EventAsPromise<unknown>;
  let addEventListener: (name: string, transform?: (...args: []) => []) => void;
  let dispatchEvent: (name: string, event?: undefined | unknown, ...extra: unknown[]) => void;

  if (type === 'node') {
    beforeEach(() => {
      eventAsPromise = new EventAsPromise();

      const emitter = new EventEmitter();

      addEventListener = (name: string, transform?: (...args: unknown[]) => unknown) => {
        emitter.on(name, (...args) => {
          const arg0 = transform ? transform(...args) : args[0];

          eventAsPromise.eventListener(arg0);
        });
      };

      dispatchEvent = (name: string, event?: undefined | unknown, ...extra: unknown[]) => {
        emitter.emit(name, event, ...extra);
      };
    });
  } else if (type === 'dom') {
    beforeEach(() => {
      eventAsPromise = new EventAsPromise();

      const target = new EventTarget();

      addEventListener = (name: string, transform?: (...args: unknown[]) => unknown) => {
        target.addEventListener(name, event => {
          const { detail } = event as CustomEvent;
          const arg0 = transform ? transform(...detail) : detail[0];

          eventAsPromise.eventListener(arg0);
        });
      };

      dispatchEvent = (name: string, detail?: undefined | unknown, ...extra: unknown[]) => {
        const event = new CustomEvent(name, { detail: [detail, ...extra] });

        target.dispatchEvent(event);
      };
    });
  }

  test('one', async () => {
    addEventListener('hello');

    const promise = eventAsPromise.one();

    await expect(hasResolved(promise)).resolves.toBeFalsy();

    dispatchEvent('hello', 'World!');

    await expect(promise).resolves.toBe('World!');
  });

  test('no backlog', async () => {
    addEventListener('count');
    dispatchEvent('count', 1);

    const onePromise = eventAsPromise.one();
    const upcomingPromise = eventAsPromise.upcoming();

    dispatchEvent('count', 2);

    await expect(hasResolved(onePromise)).resolves.toBeTruthy();
    await expect(onePromise).resolves.toBe(2);

    await expect(hasResolved(upcomingPromise)).resolves.toBeTruthy();
    await expect(upcomingPromise).resolves.toBe(2);
  });

  test('repeated', async () => {
    addEventListener('count');

    const promise1 = eventAsPromise.one();
    dispatchEvent('count', 'one');

    const promise2 = eventAsPromise.one();
    dispatchEvent('count', 'two');

    const promise3 = eventAsPromise.one();

    await expect(promise1).resolves.toBe('one');
    await expect(promise2).resolves.toBe('two');
    expect(await hasResolved(promise3)).toBeFalsy();
  });

  test('repeated backlog', async () => {
    addEventListener('count');

    const promise1 = eventAsPromise.one();
    const promise2 = eventAsPromise.one();
    const promise3 = eventAsPromise.one();

    dispatchEvent('count', 'one');
    dispatchEvent('count', 'two');

    await expect(promise1).resolves.toBe('one');
    await expect(promise2).resolves.toBe('two');
    expect(await hasResolved(promise3)).toBeFalsy();
  });

  test('using as iterator', async () => {
    addEventListener('count');

    let count = 0;

    for (const promise of eventAsPromise) {
      dispatchEvent('count', count);
      await expect(promise).resolves.toBe(count);
      count++;

      // Obtaining a future inside for-loop should not affect the for-loop
      // We specifically don't emit for this future to make sure it don't affect the for-loop
      eventAsPromise.one();

      if (count > 10) {
        break;
      }
    }
  });

  test('multiple args', async () => {
    addEventListener('count', (...args) => args);

    const promise = eventAsPromise.one();

    dispatchEvent('count', 'one', 'two');

    await expect(promise).resolves.toEqual(['one', 'two']);
  });

  test('upcoming', async () => {
    addEventListener('count');

    const promiseOne1 = eventAsPromise.upcoming();
    const promiseOne2 = eventAsPromise.upcoming();
    const promiseOne3 = eventAsPromise.one();
    const promiseTwo = eventAsPromise.one();

    dispatchEvent('count', 'one');
    dispatchEvent('count', 'two');

    await expect(promiseOne1).resolves.toBe('one');
    await expect(promiseOne2).resolves.toBe('one');
    await expect(promiseOne3).resolves.toBe('one');
    await expect(promiseTwo).resolves.toBe('two');

    const promiseThree = eventAsPromise.upcoming();

    dispatchEvent('count', 'three');

    await expect(promiseOne1).resolves.toBe('one');
    await expect(promiseThree).resolves.toBe('three');
  });
});
