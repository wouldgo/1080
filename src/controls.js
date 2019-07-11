import {nextVideo, prevVideo, play} from './player.js';

const controlsElement = document.querySelector('.controls')
  , timeStatusElement = document.querySelector('.status .time')
  , titleElement = document.querySelector('title')
  , readyEventHandler = () => {

    return controlsElement.classList.add('visible');
  }
  , currentTimeEventHanlder = ({detail}) => {

    timeStatusElement.innerHTML = detail.toFixed(0);
  }
  , fpsEventHandler = ({detail}) => {

    titleElement.text = detail;
  };

controlsElement.addEventListener('player:ready', readyEventHandler, false);
controlsElement.addEventListener('player:current-time', currentTimeEventHanlder, false);
document.addEventListener('interaction:fps', fpsEventHandler, false);

window.playVideo = () => play();
window.playPrevVideo = () => prevVideo();
window.playNextVideo = () => nextVideo();
