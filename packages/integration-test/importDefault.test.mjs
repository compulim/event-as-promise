import { EventAsPromise } from 'event-as-promise';

test('simple scenario', async () => {
  const target = new EventTarget();
  const eventAsPromise = new EventAsPromise();

  target.addEventListener('count', eventAsPromise.eventListener);

  const promiseOne1 = eventAsPromise.upcoming();
  const promiseOne2 = eventAsPromise.upcoming();
  const promiseOne3 = eventAsPromise.one();
  const promiseTwo = eventAsPromise.one();

  target.dispatchEvent(new CustomEvent('count', { detail: 'one' }));
  target.dispatchEvent(new CustomEvent('count', { detail: 'two' }));

  await expect(promiseOne1).resolves.toEqual(expect.objectContaining({ detail: 'one' }));
  await expect(promiseOne2).resolves.toEqual(expect.objectContaining({ detail: 'one' }));
  await expect(promiseOne3).resolves.toEqual(expect.objectContaining({ detail: 'one' }));
  await expect(promiseTwo).resolves.toEqual(expect.objectContaining({ detail: 'two' }));

  const promiseThree = eventAsPromise.upcoming();

  target.dispatchEvent(new CustomEvent('count', { detail: 'three' }));

  await expect(promiseOne1).resolves.toEqual(expect.objectContaining({ detail: 'one' }));
  await expect(promiseThree).resolves.toEqual(expect.objectContaining({ detail: 'three' }));
});
