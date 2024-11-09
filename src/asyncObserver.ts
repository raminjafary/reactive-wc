type Callback<T extends any> = (key: keyof T, value: T[keyof T]) => void;

export class AsyncObserver<T> {
  data: T;
  subscribers: Callback<T>[];

  constructor(initialData: T) {
    this.data = initialData;
    this.subscribers = [];
  }

  subscribe(callback: Callback<T>) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
    this.subscribers.push(callback);
  }

  async set<V extends T[keyof T]>(key: keyof T, value: V) {
    this.data[key] = value;

    const updates = this.subscribers.map(async (callback) => {
      await callback(key, value);
    });

    await Promise.allSettled(updates);
  }
}

const data = new AsyncObserver({ pizza: "Pepperoni" });

data.subscribe(async (key, value) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(`Updated UI for ${key}: ${value}`);
});

data.subscribe(async (key, value) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Logged change for ${key}: ${value}`);
});

async function updateData() {
  await data.set("pizza", "Supreme");
  console.log("All updates complete.");
}

updateData();
