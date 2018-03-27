import createDeferred from './createDeferred';

export default class EventAsPromise {
  constructor(options = {}) {
    this.defers = [];
    this.eventListener = this.eventListener.bind(this);
    this.options = options;

    this.one = this.one.bind(this);

    this[Symbol.iterator] = () => ({
      next: () => ({
        done: false,
        value: this.one()
      })
    });
  }

  eventListener(event) {
    const deferred = this.defers.shift();
    const args = this.options.array ? [].slice.call(arguments) : event;

    deferred && deferred.resolve(args);
  }

  one() {
    const deferred = createDeferred();

    this.defers.push(deferred);

    return deferred.promise;
  }
}
