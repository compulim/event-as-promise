type Resolvers<T> = {
  reject: (error: unknown) => void;
  resolve: (value: T) => void;
  promise: Promise<T>;
};

function withResolvers<T>(): Resolvers<T> {
  const resolvers: Partial<Resolvers<T>> = {};

  resolvers.promise = new Promise((resolve, reject) => {
    resolvers.reject = reject;
    resolvers.resolve = resolve;
  });

  return resolvers as Resolvers<T>;
}

export class EventAsPromise<T> {
  constructor() {
    this.#eventListener = (event: T) => {
      const deferred = this.#orderedResolvers.shift();

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      deferred && deferred.resolve(event);

      if (this.#upcomingResolvers) {
        this.#upcomingResolvers.resolve(event);
        this.#upcomingResolvers = undefined;
      }
    };
  }

  #eventListener: (event: T) => void;
  #orderedResolvers: Resolvers<T>[] = [];
  #upcomingResolvers: Resolvers<T> | undefined = undefined;

  get eventListener() {
    return this.#eventListener;
  }

  [Symbol.iterator]() {
    return {
      next: () => ({
        done: false,
        value: this.upcoming()
      })
    };
  }

  one() {
    const deferred = withResolvers<T>();

    this.#orderedResolvers.push(deferred);

    return deferred.promise;
  }

  upcoming() {
    if (!this.#upcomingResolvers) {
      this.#upcomingResolvers = withResolvers<T>();
    }

    return this.#upcomingResolvers.promise;
  }
}
