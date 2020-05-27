import createDeferred from './external/p-defer';

export default class EventAsPromise {
  constructor(options = {}) {
    this.queue = [];
    this.defers = [];
    this.upcomingDeferred = null;
    this.eventListener = this.eventListener.bind(this);
    this.options = options;

    this.one = this.one.bind(this);
    this.upcoming = this.upcoming.bind(this);

    this[Symbol.iterator] = () => ({
      next: () => ({
        done: false,
        value: this.upcoming()
      })
    });
  }

  eventListener(event) {
    const deferred = this.defers.shift();
    const args = this.options.array ? [].slice.call(arguments) : event;

    if (deferred) {
      deferred.resolve(args);
    } else if (this.options.queue) {
      const newDeferred = createDeferred();
      newDeferred.resolve(args);
      this.queue.push(newDeferred.promise);
    }

    if (this.upcomingDeferred) {
      this.upcomingDeferred.resolve(args);
      this.upcomingDeferred = null;
    }
  }

  one() {
    if (this.options.queue && this.queue.length > 0) {
      return this.queue.shift();
    }

    const deferred = createDeferred();

    this.defers.push(deferred);

    return deferred.promise;
  }

  upcoming() {
    if (!this.upcomingDeferred) {
      this.upcomingDeferred = createDeferred();
    }

    return this.upcomingDeferred.promise;
  }
}
