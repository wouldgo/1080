import {nextVideo, prevVideo, play, restart} from './player.js';

const bodyElement = document.querySelector('body')
  , prevElement = document.querySelector('.prev')
  , playElement = document.querySelector('.play')
  , pauseElement = document.querySelector('.pause')
  , replayElement = document.querySelector('.replay')
  , nextElement = document.querySelector('.next');

bodyElement.addEventListener('player:ready', () => {
  playElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:playing', () => {

  playElement.classList.add('hidden');
  pauseElement.classList.remove('hidden');
  replayElement.classList.remove('hidden');
  prevElement.classList.remove('hidden');
  nextElement.classList.remove('hidden');
});
bodyElement.addEventListener('player:paused', () => {

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
