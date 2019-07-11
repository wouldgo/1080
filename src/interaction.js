export const animation = stuff => {
  let oldTimestamp
    , fps
    , actualRequest
    , whenThisWillBe0 = 500;
  const stopItNow = () => {

    if (actualRequest) {

      window.cancelAnimationFrame(actualRequest);
    }
  }
  , step = timestamp => {
    actualRequest = window.requestAnimationFrame(step);
    if (oldTimestamp) {

      fps = Math.round(1000 / (timestamp - oldTimestamp));
    }

    oldTimestamp = timestamp;

    stuff();
    whenThisWillBe0 -= 1;
    if (whenThisWillBe0) {

      const fpsEvent = new window.CustomEvent('interaction:fps', {
        'detail': fps
      });

      document.dispatchEvent(fpsEvent);
      whenThisWillBe0 = 500;
    }
  };

  actualRequest = window.requestAnimationFrame(step);

  return stopItNow;
};
