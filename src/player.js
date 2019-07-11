import {animation} from './interaction.js';

let readySent = false
  , playerFocused = 0
  , isPlaying = false
  , currentTime;
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
    'controls': 0,
    'disablekb': 1,
    'fs': 0,
    'iv_load_policy': 3,
    'modestbranding': 1,
    'rel': 0,
    'showinfo': 0
  }
  , tag = document.createElement('script')
  , playersStatuses = new Map()
  , onReady = identifier => () => {
    const thisStatus = playersStatuses.get(identifier);

    playersStatuses.set(identifier, Object.assign(thisStatus, {
      'status': YT.PlayerState.UNSTARTED
    }));

    thisStatus.player.seekTo(0);
    thisStatus.player.pauseVideo();
  }
  , switchAudio = () => {
    const unFocused = players.filter(elm => elm !== players[playerFocused])
      , focusedPlayer = playersStatuses.get(`player-${playerFocused}`).player;

    unFocused
      .map(aPlayerName => playersStatuses.get(aPlayerName))
      .map(elm => elm.player)
      .forEach(elm => elm.pauseVideo());

    focusedPlayer.seekTo(currentTime);
    focusedPlayer.playVideo();
  }
  , playerLoop = () => {
    const playersStatusesArray = Array.from(playersStatuses.entries());

    if (playersStatusesArray.length === players.length) {
      const allAreReady = playersStatusesArray
        .map(elm => elm[1])
        .map(elm => elm.status)
        .every(elm => elm === YT.PlayerState.UNSTARTED);

      if (allAreReady) {
        const newTime = playersStatuses.get(`player-${playerFocused}`).player.getCurrentTime();

        if (newTime !== currentTime) {

          currentTime = newTime;
          const currentTimeEvent = new window.CustomEvent('player:current-time', {
            'detail': currentTime
          });

          controlsElement.dispatchEvent(currentTimeEvent);
        }
      }

      playersStatusesArray
        .map(elm => elm[1])
        .forEach((elm, index) => {
          const {player} = elm;

          if (index === playerFocused) {

            player.getIframe().classList.add('visible');
            return;
          }

          player.getIframe().classList.remove('visible');
        });

      if (!readySent && allAreReady) {
        const playerReady = new window.Event('player:ready');

        readySent = true;
        controlsElement.dispatchEvent(playerReady);
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
        'onReady': onReady(players[0])
      }
    })
    , player2 = new YT.Player(players[1], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[1],
      playerVars,
      'events': {
        'onReady': onReady(players[1])
      }
    })
    , player3 = new YT.Player(players[2], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[2],
      playerVars,
      'events': {
        'onReady': onReady(players[2])
      }
    });

    playersStatuses.set(players[0], Object.assign({}, {
      'player': player1
    }));
    playersStatuses.set(players[1], Object.assign({}, {
      'player': player2
    }));
    playersStatuses.set(players[2], Object.assign({}, {
      'player': player3
    }));
};

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

export const nextVideo = () => {
  playerFocused = (playerFocused + 1) % players.length;

  return switchAudio();
};

export const prevVideo = () => {
  const newValue = (playerFocused - 1) % players.length;

  if (newValue < 0) {

    playerFocused = players.length + newValue;
  } else {

    playerFocused = newValue;
  }

  return switchAudio();
};

export const play = () => {

  if (!isPlaying) {

    isPlaying = true;
    return playersStatuses.get(`player-${playerFocused}`).player.playVideo();
  }

  isPlaying = false;
  playersStatuses.get(`player-${playerFocused}`).player.pauseVideo();
};
