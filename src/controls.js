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
  , linearProgress = new mdc.linearProgress.MDCLinearProgress(progressElement);

document.addEventListener('DOMContentLoaded', () => {
  bannerElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:time', event => {
  linearProgress.buffer = event.detail;
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
  bannerElement.classList.add('hidden');

  playElement.classList.add('hidden');
  pauseElement.classList.remove('hidden');
  replayElement.classList.remove('hidden');
  prevElement.classList.remove('hidden');
  nextElement.classList.remove('hidden');
});
bodyElement.addEventListener('player:paused', () => {
  controlsElement.classList.add('paused');
  progressElement.classList.add('hidden');
  bannerElement.classList.remove('hidden');

  playElement.classList.remove('hidden');
  pauseElement.classList.add('hidden');
  replayElement.classList.add('hidden');
  prevElement.classList.add('hidden');
  nextElement.classList.add('hidden');
});

prevElement.addEventListener('click', () => {
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
  return nextVideo();
}, false);
