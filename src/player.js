import {animation} from './interaction.js';

let playerFocused = -1
  , isPlaying = false
  , currentTime = -1;
const bodyElement = document.querySelector('body')
  , resolution = [800, 600]
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
  , playersStatuses = new Map()
  , switchAudio = () => {
    const unFocused = players.filter(elm => elm !== players[playerFocused])
      , focusedPlayerSelector = `player-${playerFocused}`
      , focusedPlayer = playersStatuses.get(focusedPlayerSelector).player
      , focusedIframe = focusedPlayer.getIframe();

    unFocused
      .map(aPlayerName => playersStatuses.get(aPlayerName))
      .filter(elm => elm)
      .map(elm => elm.player)
      .map(elm => {
        elm.getIframe().classList.remove('visible');

        return elm;
      })
      .forEach(elm => elm.mute());

    if (!isPlaying) {

      focusedPlayer.getIframe().classList.remove('visible');
      focusedPlayer.mute();
      return;
    }

    focusedIframe.classList.add('visible');

    if (currentTime > focusedPlayer.getCurrentTime()) {

      focusedPlayer.seekTo(currentTime, true);
    }

    focusedPlayer.unMute();
  }
  , playerLoop = () => {
    const playersStatusesArray = Array.from(playersStatuses.entries());

    if (playersStatusesArray.length === players.length) {
      if (playerFocused !== -1 &&
        isPlaying) {
        const player = playersStatuses.get(`player-${playerFocused}`).player
          , newTime = player.getCurrentTime();

          if (newTime > currentTime) {

          currentTime = newTime;
          const currentTimeEvent = new window.CustomEvent('player:current-time', {
            'detail': currentTime
          });

          bodyElement.dispatchEvent(currentTimeEvent);
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
      'playerVars': {
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0
      }
    })
    , player2 = new YT.Player(players[1], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[1],
      'playerVars': {
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0
      }
    })
    , player3 = new YT.Player(players[2], {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[2],
      'playerVars': {
        'controls': 0,
        'disablekb': 1,
        'fs': 0,
        'iv_load_policy': 3,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0
      }
    });

    player1.addEventListener('onReady', event => {

      event.target.mute();
      event.target.seekTo(0);
    });
    player2.addEventListener('onReady', event => {

      event.target.mute();
      event.target.seekTo(0);
    });
    player3.addEventListener('onReady', event => {

      event.target.mute();
      event.target.seekTo(0);
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

  if (isPlaying) {

    isPlaying = false;
  } else {

    isPlaying = true;
    if (playerFocused === -1) {

      playerFocused = 0;
    }
  }

  return switchAudio();
};
