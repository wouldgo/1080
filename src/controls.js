/*global mdc*/
import {nextVideo, prevVideo, play, restart} from './player.js';

const bodyElement = document.querySelector('body')
  , bannerContainer = document.querySelector('#banner')
  , loadingContainer = document.querySelector('#loading')
  , waitPlsElement = document.querySelector('.wait-pls')
  , startAllElement = document.querySelector('#banner .loading .play')
  , videoContainer = document.querySelector('#video')
  , controlsElement = document.querySelector('.controls')
  , loadingElement = document.querySelector('.loading')
  , prevElement = document.querySelector('.prev')
  , pauseElement = document.querySelector('.pause')
  , replayElement = document.querySelector('.replay')
  , nextElement = document.querySelector('.next')
  , progressElement = document.querySelector('.mdc-linear-progress')
  , timeElement = document.querySelector('.time')
  , linearProgress = new mdc.linearProgress.MDCLinearProgress(progressElement)
  , formatTime = function format(time) {
      // Hours, minutes and seconds
      /* eslint-disable no-bitwise */
      const hrs = ~~(time / 3600)
        , mins = ~~((time % 3600) / 60)
        , secs = ~~time % 60;
      /* eslint-enable */

      let ret = '';

      if (hrs > 0) {
        ret += `${String(hrs) }:${ mins < 10 ? '0' : ''}`;
      }
      ret += `${String(mins) }:${ secs < 10 ? '0' : ''}`;
      ret += `${ secs}`;
      return ret;
    };

document.addEventListener('DOMContentLoaded', () => {
  bannerContainer.classList.remove('hidden');
  loadingContainer.classList.add('hidden');
}, false);

bodyElement.addEventListener('player:ready', () => {
  bannerContainer.classList.remove('hidden');
  waitPlsElement.classList.add('hidden');
  startAllElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:playing', () => {
  bannerContainer.classList.add('hidden');
  videoContainer.classList.remove('hidden');
  //controlsElement.classList.remove('paused');
  //progressElement.classList.remove('hidden');
  //timeElement.classList.remove('hidden');

  //playElement.classList.add('hidden');
  //pauseElement.classList.remove('hidden');
  //replayElement.classList.remove('hidden');
  //prevElement.classList.remove('hidden');
  //nextElement.classList.remove('hidden');

  //prevElement.innerHTML = 'arrow_back';
  //prevElement.classList.remove('spin');
  //nextElement.innerHTML = 'arrow_forward';
  //nextElement.classList.remove('spin');
});

startAllElement.addEventListener('click', () => {
  return play();
}, false);
