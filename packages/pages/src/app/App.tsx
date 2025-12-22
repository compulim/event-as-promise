import { EventAsPromise } from 'event-as-promise';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const App = () => {
  const [resolved, setResolved] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const eventAsPromise = useMemo(() => new EventAsPromise(), []);

  useEffect(() => {
    let obsoleted = false;

    (async () => {
      await eventAsPromise.one();

      obsoleted || setResolved(true);
    })();

    return () => {
      obsoleted = true;
    };
  }, [eventAsPromise, setResolved]);

  useEffect(() => {
    buttonRef.current?.addEventListener('click', eventAsPromise.eventListener);
  }, [buttonRef, eventAsPromise]);

  return (
    <div>
      <h1>event-as-promise demo</h1>
      <p>
        Promise resolved: <code>{'' + resolved}</code>
      </p>
      <button autoFocus={true} ref={buttonRef} type="button">
        Click me
      </button>
    </div>
  );
};

export default App;
