export const animation = stuff => {
  let actualRequest;
  const stopItNow = () => {

    if (actualRequest) {

      window.cancelAnimationFrame(actualRequest);
    }
  }
  , step = () => {
    actualRequest = window.requestAnimationFrame(step);

    stuff();
  };

  actualRequest = window.requestAnimationFrame(step);
  return stopItNow;
};
