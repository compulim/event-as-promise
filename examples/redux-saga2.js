import { applyMiddleware, createStore } from 'redux';
import { call, race, put, take, takeLatest } from 'redux-saga/effects';
import { EventEmitter } from 'events';
import createSagaMiddleware from 'redux-saga';

import EventAsPromise from '../src';

const fs = {
  watch: () => {
    watcher = new EventEmitter();
    watcher.close = () => watcher.closed = true;

    return watcher;
  }
};

let watcher;

test('watch', async () => {
  const saga = createSagaMiddleware();
  const store = createStore((state = [], action) => {
    if (action.type === 'CHANGED') {
      state.push(action.payload);
    }

    return state;
  }, applyMiddleware(saga));

  saga.run(function* () {
    yield takeLatest('CONNECTED', function* (action) {
      const watcher = fs.watch(action.payload);
      const changePromises = new EventAsPromise({ array: true });

      watcher.on('change', changePromises.eventListener);

      for (;;) {
        const [changes] = yield race([
          call(changePromises.one),
          take('DISCONNECTED'),
        ]);

        if (changes) {
          yield put({ type: 'CHANGED', payload: changes });
        } else {
          break;
        }
      }

      watcher.close();
    });
  });

  store.dispatch({ type: 'CONNECTED' });
  watcher.emit('change', 'one', 1);
  await 0;
  watcher.emit('change', 'two', 2);
  await 0;
  store.dispatch({ type: 'DISCONNECTED' });
  expect(watcher).toHaveProperty('closed', true);
  watcher.emit('change', 'three', 3);
  await 0;

  expect(store.getState()).toEqual([
    ['one', 1],
    ['two', 2],
  ]);
});
