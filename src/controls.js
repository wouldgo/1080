import {nextVideo, prevVideo, play} from './player.js';

const playerElement = document.querySelector('.player')
  , titleElement = document.querySelector('title')
  , currentTimeEventHanlder = ({detail}) => {
    const [, ...rest] = titleElement.text.split(' - ');

    titleElement.text = [
      [
        'Time',
        detail.toFixed(0)
      ].join(': '),
      ...rest
    ].join(' - ');
  }
  , fpsEventHandler = ({detail}) => {
    const [time, , ...rest] = titleElement.text.split(' - ');

    titleElement.text = [
      time,
      [
        'Fps: ',
        detail
      ].join(': '),
      ...rest
    ].join(' - ');
  };

playerElement.addEventListener('player:current-time', currentTimeEventHanlder, false);
document.addEventListener('interaction:fps', fpsEventHandler, false);

document.addEventListener('keyup', event => {
  event.preventDefault();
  const key = event.key || event.keyCode;

  if (key === ' ' || key === 32) { //Play

    return play();
  } else if (key === 'ArrowRight' || key === 39) { //Next

    return nextVideo();
  } else if (key === 'ArrowLeft' || key === 37) { //Prev

    return prevVideo();
  }

  /*eslint-disable no-console*/
  console.info(event.key, event.keyCode);
  /*eslint-enable*/
});
