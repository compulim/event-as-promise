import { applyMiddleware, createStore } from 'redux';
import { call } from 'redux-saga/effects';
import { EventEmitter } from 'events';
import createSagaMiddleware from 'redux-saga';

import EventAsPromise from '../src';

function setup() {
  const emitter = new EventEmitter();
  const saga = createSagaMiddleware();
  const store = createStore(s => s, applyMiddleware(saga));

  return { emitter, saga, store };
}

test('call', async () => {
  const { emitter, saga, store } = setup();

  setImmediate(() => emitter.emit('count', 1));

  await new Promise(resolve => {
    saga.run(function* () {
      const eventAsPromise = new EventAsPromise();

      emitter.on('count', eventAsPromise.eventListener);

      const result = yield call(eventAsPromise.one);

      expect(result).toBe(1);

      resolve();
    });
  });
});
