import {nextVideo, prevVideo, play} from './player.js';

const bodyElement = document.querySelector('body')
  , titleElement = document.querySelector('title')
  , prevElement = document.querySelector('.prev')
  , playElement = document.querySelector('.play')
  , pauseElement = document.querySelector('.pause')
  , nextElement = document.querySelector('.next');

bodyElement.addEventListener('player:current-time', ({detail}) => {
  titleElement.text = `Time: ${detail}`;
}, false);

bodyElement.addEventListener('player:ready', () => {
  playElement.classList.remove('hidden');
}, false);

bodyElement.addEventListener('player:playing', () => {

  playElement.classList.add('hidden');
  pauseElement.classList.remove('hidden');

  prevElement.classList.remove('hidden');
  nextElement.classList.remove('hidden');
});
bodyElement.addEventListener('player:paused', () => {

  playElement.classList.remove('hidden');
  pauseElement.classList.add('hidden');

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

nextElement.addEventListener('click', () => {
  return nextVideo();
}, false);
