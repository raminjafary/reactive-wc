type Effect = {
  execute(): void;
  dependencies: Set<Dep>;
};
type Dep = Set<Effect>;
type SignalRead<T> = () => T extends undefined ? undefined : T;
type SignalWrite<T> = (...args: T[]) => void;

let context: Effect[] = [];

export function untrack<T extends () => any>(fn: T): ReturnType<T> {
  const prevContext = context;
  context = [];
  const res = fn();
  context = prevContext;
  return res;
}

function cleanup(observer: Effect) {
  for (const dep of observer.dependencies) {
    dep.delete(observer);
  }
  observer.dependencies.clear();
}

function subscribe(observer: Effect, subscribtions: Dep) {
  subscribtions.add(observer);
  observer.dependencies.add(subscribtions);
}

export function createSignal<T = undefined>(
  value?: T
): [SignalRead<T>, SignalWrite<T>] {
  const subscribtions: Dep = new Set();

  const read = () => {
    const observer = context[context.length - 1];
    if (observer) subscribe(observer, subscribtions);
    return value;
  };

  const write = (newValue: T) => {
    value = newValue;
    for (const observer of [...subscribtions]) {
      observer.execute();
    }
  };

  return [read as SignalRead<T>, write];
}

export function createEffect(fn: (...args: any[]) => any) {
  const effect: Effect = {
    execute() {
      cleanup(effect);
      context.push(effect);
      fn();
      context.pop();
    },
    dependencies: new Set(),
  };

  effect.execute();
}

export function createMemo<T extends () => any>(fn: T) {
  const [signal, setSignal] = createSignal();
  createEffect(() => setSignal(fn()));
  return signal as SignalRead<ReturnType<T>>;
}

const [count, setCount] = createSignal(2);
const [count2, setCount2] = createSignal(2);

const sum = createMemo(() => count() + count2());

createEffect(() => {
  console.log(count(), count2(), sum());
  console.log(untrack(() => count()));
});

setCount(10);
setCount2(33);
