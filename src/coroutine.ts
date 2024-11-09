function* EventLoop({ reducer, state }) {
    while (true) {
      const action = yield state;
      state = reducer(state, action);
    }
  }
  
  function createEventLoop({ reducer, state }) {
    const eventLoop = EventLoop({ reducer, state });
    eventLoop.next();
    return (action) => eventLoop.next(action).value;
  }
  
  function createSubscribable() {
    const evtName = "state-changed";
    const eventTarget = new EventTarget();
  
    const notify = () => eventTarget.dispatchEvent(new CustomEvent(evtName));
  
    const subscribe = (listener) => {
      eventTarget.addEventListener(evtName, listener);
      return () => unsubscribe(listener);
    };
  
    const unsubscribe = (listener) => {
      eventTarget.removeEventListener(evtName, listener);
    };
  
    return {
      subscribe,
      notify,
      unsubscribe,
    };
  }
  
  function createStore({ reducer, initialState }) {
    let state = initialState;
  
    const { notify, subscribe, unsubscribe } = createSubscribable();
  
    const dispatch = createEventLoop({ reducer, state });
  
    return {
      subscribe,
      unsubscribe,
      getState() {
        return structuredClone(state);
      },
      dispatch(action) {
        state = dispatch(action);
        notify();
      },
    };
  }
  
  const store = createStore({
    reducer: (state, action) => {
      switch (action.type) {
        case "increment":
          return {
            ...state,
            count: state.count + 1,
          };
        case "decrement":
          return {
            ...state,
            count: state.count - 1,
          };
        default:
          return state;
      }
    },
    initialState: {
      count: 0,
    },
  });
  
  store.subscribe(() => console.log(store.getState()));
  
  store.dispatch({
    type: "increment",
  }); // log { count: 1 }
  store.dispatch({
    type: "increment",
  }); // log { count: 2 }
  store.dispatch({
    type: "decrement",
  }); // log { count: 1 }
  