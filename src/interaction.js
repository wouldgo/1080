export const animation = stuff => {
  let start
    , actualRequest;
  const stopItNow = () => {

    if (actualRequest) {

      window.cancelAnimationFrame(actualRequest);
    }
  }
  , step = timestamp => {
    if (!start) {

      start = timestamp;
    }
    const progress = timestamp - start;

    stuff();
    if (progress < 2000) {
      actualRequest = window.requestAnimationFrame(step);
    }
  };

  actualRequest = window.requestAnimationFrame(step);

  return stopItNow;
};
