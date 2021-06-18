

progressElement.addEventListener('click', event => {
  /*eslint-disable id-length*/
  const {x} = event
  /*eslint-enable*/
    , width = progressElement.clientWidth
    , left = progressElement.getBoundingClientRect().left
    , proportion = (x - left) / width
    , postionEvent = new window.CustomEvent('controls:skipTo', {
      'detail': proportion
    });

  bodyElement.dispatchEvent(postionEvent);
}, false);

bodyElement.addEventListener('player:time', event => {
  const {buffer, progress, currentTime, duration} = event.detail;

  timeElement.innerHTML = [formatTime(currentTime), formatTime(duration)].join(' / ');
  linearProgress.buffer = buffer;
  linearProgress.progress = progress;
}, false);


bodyElement.addEventListener('player:paused', () => {
  controlsElement.classList.add('paused');
  progressElement.classList.add('hidden');
  timeElement.classList.add('hidden');
  bannerContainer.classList.remove('hidden');

  playElement.classList.remove('hidden');
  pauseElement.classList.add('hidden');
  replayElement.classList.add('hidden');
  prevElement.classList.add('hidden');
  nextElement.classList.add('hidden');
});

prevElement.addEventListener('click', () => {
  if (prevElement.innerHTML === 'refresh') {

    return;
  }
  prevElement.innerHTML = 'refresh';
  prevElement.classList.add('spin');

  return prevVideo();
}, false);

playElement.addEventListener('click', () => {
  return play();
}, false);

pauseElement.addEventListener('click', () => {
  return play();
}, false);

replayElement.addEventListener('click', () => {
  return restart();
}, false);

nextElement.addEventListener('click', () => {
  if (nextElement.innerHTML === 'refresh') {

    return;
  }
  nextElement.innerHTML = 'refresh';
  nextElement.classList.add('spin');

  return nextVideo();
}, false);
