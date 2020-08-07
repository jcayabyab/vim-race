const setTimeoutPromise = (t) => {
  return new Promise((resolve) => setTimeout(resolve, t));
};

export default setTimeoutPromise;
