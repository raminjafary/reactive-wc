type Observer = {
  next: (value: any) => any;
  error: (err: any) => any;
  complete: () => any;
};

class Observable {
  constructor(public producer: (observer: Observer) => () => any) {
    this.producer = producer;
  }

  subscribe(observer: Observer) {
    if (typeof observer !== "object" || observer === null) {
      throw new Error(
        "Observer must be an object with next, error, and complete methods"
      );
    }

    if (typeof observer.next !== "function") {
      throw new Error("Observer must have a next method");
    }

    if (typeof observer.error !== "function") {
      throw new Error("Observer must have an error method");
    }

    if (typeof observer.complete !== "function") {
      throw new Error("Observer must have a complete method");
    }

    const unsubscribe = this.producer(observer);

    return {
      unsubscribe() {
        if (unsubscribe && typeof unsubscribe === "function") {
          unsubscribe();
        }
      },
    };
  }
}

const observable = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();

  return () => {
    console.log("Observer unsubscribed");
  };
});

const observer: Observer = {
  next: (value) => console.log("Received value:", value),
  error: (err) => console.log("Error:", err),
  complete: () => console.log("Completed"),
};

const subscription = observable.subscribe(observer);

subscription.unsubscribe();
