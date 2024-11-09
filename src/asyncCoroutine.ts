function co(genFunc) {
    return (...args) => {
      const gen = genFunc(...args);
  
      return next();
  
      function next(data) {
        const { value, done } = gen.next(data);
  
        if (done) {
          return value;
        }
  
        if (value?.then === undefined) {
          return next(value);
        }
  
        return value.then(next);
      }
    };
  }
  
  const fn = co(function* (a, b) {
    let value = yield Promise.resolve(a);
    value = yield Promise.resolve(b * value);
    return value;
  });
  
  fn(2, 4).then(console.log);
  