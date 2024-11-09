export class Subject {
  observers: Observer[];

  constructor() {
    this.observers = [];
  }

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    const index = this.observers.indexOf(observer);

    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify<T>(data: T) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  update<T>(data: T) {
    console.log(data);
  }
}

const subject = new Subject();
const observer = new Observer();

subject.addObserver(observer);
subject.notify("Everyone gets pizzas!");

