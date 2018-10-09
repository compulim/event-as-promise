import fetch from 'node-fetch';
import getPort from 'get-port';
import http from 'http';

import EventAsPromise from '../src';

async function main(ready) {
  const port = await getPort();
  const server = http.createServer();
  const listeningPromises = new EventAsPromise();
  const requestPromises = new EventAsPromise({ array: true });

  server
    .once('listening', listeningPromises.eventListener)
    .on('request', requestPromises.eventListener)
    .listen(port);

  // Wait for server "listening"
  await listeningPromises.one();

  // --- START OF TEST CODE ---
  ready(port, () => {
    server.close();
  });
  // --- END OF TEST CODE ---

  // Wait for "request"
  for (let requestPromise of requestPromises) {
    const [req, res] = await requestPromise;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
  }
}

test('receive request', () => {
  return new Promise((resolve, reject) => {
    main((port, close) => {
      (async () => {
        try {
          const res = await fetch(`http://localhost:${ port }`);

          expect(res.status).toBe(200);
          expect(await res.text()).toBe('Hello World\n');

          resolve();
        } catch (err) {
          reject(err);
        } finally {
          close();
        }
      })();
    });
  });
});
