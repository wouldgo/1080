import {nextVideo, prevVideo, play} from './player.js';

const bodyElement = document.querySelector('body')
  , titleElement = document.querySelector('title')
  , currentTimeEventHanlder = ({detail}) => {

    titleElement.text = `Time: ${detail}`;
  };

bodyElement.addEventListener('player:current-time', currentTimeEventHanlder, false);

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
