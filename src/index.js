import createDeferred from './createDeferred';

export default class EventAsPromise {
  constructor(options = {}) {
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

    deferred && deferred.resolve(args);

    if (this.upcomingDeferred) {
      this.upcomingDeferred.resolve(args);
      this.upcomingDeferred = null;
    }
  }

  one() {
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
