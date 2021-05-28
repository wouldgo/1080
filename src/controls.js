/*global mdc*/
import {nextVideo, prevVideo, play, restart} from './player.js';

const bodyElement = document.querySelector('body')
  , bannerElement = document.querySelector('.banner')
  , controlsElement = document.querySelector('.controls')
  , loadingElement = document.querySelector('.loading')
  , prevElement = document.querySelector('.prev')
  , playElement = document.querySelector('.play')
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

document.addEventListener('DOMContentLoaded', () => {
  bannerElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:time', event => {
  const {buffer, progress, currentTime, duration} = event.detail;

  timeElement.innerHTML = [formatTime(currentTime), formatTime(duration)].join(' / ');
  linearProgress.buffer = buffer;
  linearProgress.progress = progress;
}, false);

bodyElement.addEventListener('player:ready', () => {
  loadingElement.classList.add('hidden');

  controlsElement.classList.add('paused');
  playElement.classList.remove('hidden');
  bannerElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:playing', () => {
  controlsElement.classList.remove('paused');
  progressElement.classList.remove('hidden');
  timeElement.classList.remove('hidden');
  bannerElement.classList.add('hidden');

  playElement.classList.add('hidden');
  pauseElement.classList.remove('hidden');
  replayElement.classList.remove('hidden');
  prevElement.classList.remove('hidden');
  nextElement.classList.remove('hidden');

  prevElement.innerHTML = 'arrow_back';
  prevElement.classList.remove('spin');
  nextElement.innerHTML = 'arrow_forward';
  nextElement.classList.remove('spin');
});
bodyElement.addEventListener('player:paused', () => {
  controlsElement.classList.add('paused');
  progressElement.classList.add('hidden');
  timeElement.classList.add('hidden');
  bannerElement.classList.remove('hidden');

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
