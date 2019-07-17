import {animation} from './interaction.js';

let readySent = false
  , playerFocused = 0
  , nextFocused = 0
  , isPlaying = false
  , currentTime = 0;
const controlsElement = document.querySelector('.controls')
  , resolution = [640, 480]
  , players = [
    'player-0',
    'player-1',
    'player-2'
  ]
  , videoIds = [
    'zk1us0NYfug',
    'xQLB3g0KqmY',
    'YERHP5wp_zw'
  ]
  , playerVars = {
    'autoplay': 0,
    'color': 'black',
    'controls': 0,
    'disablekb': 1,
    'enablejsapi': 1,
    'fs': 0,
    'iv_load_policy': 3,
    'modestbranding': 1,
    'rel': 0
  }
  , tag = document.createElement('script')
  , playersStatuses = new Map()
  , playerLoop = () => {
    if (playersStatuses.size === players.length) {
      if (!readySent) {
        const playerReady = new window.Event('player:ready');

        readySent = true;
        controlsElement.dispatchEvent(playerReady);
      }

      if (isPlaying) {
        const currentPlayer = playersStatuses.get(`player-${playerFocused}`)
          , newTime = currentPlayer.getCurrentTime();

        if (newTime !== currentTime) {

          currentTime = newTime;
          const currentTimeEvent = new window.CustomEvent('player:current-time', {
            'detail': currentTime
          });

          controlsElement.dispatchEvent(currentTimeEvent);
        }

        if (playerFocused !== nextFocused) {
          const nextPlayer = playersStatuses.get(`player-${nextFocused}`);

          currentPlayer.getIframe().classList.remove('visible');
          currentPlayer.mute();

          nextPlayer.getIframe().classList.add('visible');
          nextPlayer.seekTo(currentTime);
          nextPlayer.unMute();

          playerFocused = nextFocused;
        }
      }
    }
  };

animation(playerLoop);
window.onYouTubeIframeAPIReady = () => {
  const player1 = new YT.Player(players[0], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[0],
      playerVars,
      'events': {
        'onReady': () => {

          player1.mute();
          player1.seekTo(0);
          playersStatuses.set(players[0], player1);
        }
      }
    })
    , player2 = new YT.Player(players[1], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[1],
      playerVars,
      'events': {
        'onReady': () => {

          player2.mute();
          player2.seekTo(0);
          playersStatuses.set(players[1], player2);
        }
      }
    })
    , player3 = new YT.Player(players[2], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[2],
      playerVars,
      'events': {
        'onReady': () => {

          player3.mute();
          player3.seekTo(0);
          playersStatuses.set(players[2], player3);
        }
      }
    });
};

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

export const nextVideo = () => {
  nextFocused = (playerFocused + 1) % players.length;
};

export const prevVideo = () => {
  const newValue = (playerFocused - 1) % players.length;

  if (newValue < 0) {

    nextFocused = players.length + newValue;
  } else {

    nextFocused = newValue;
  }
};

export const play = () => {
  const currentPlayer = playersStatuses.get(`player-${playerFocused}`);

  if (!isPlaying) {

    isPlaying = true;
    currentPlayer.getIframe().classList.add('visible');
    currentPlayer.seekTo(currentTime);
    currentPlayer.unMute();
    return;
  }

  isPlaying = false;
  currentPlayer.getIframe().classList.remove('visible');
  currentPlayer.mute();
};
