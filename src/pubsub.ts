type Callback = (...args: any[]) => any;

export const pubSub = {
  events: {} as Record<string, Callback[]>,
  subscribe(event: string, callback: Callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },

  publish<T>(event: string, data: T) {
    if (this.events[event])
      this.events[event].forEach((callback) => callback(data));
  },
};

pubSub.subscribe("update", (data) => console.log(data));
pubSub.publish("update", "Some update");
