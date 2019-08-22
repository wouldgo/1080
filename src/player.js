import {animation} from './interaction.js';

let readySent = false
  , playerFocused = -1
  , isPlaying = false
  , currentTime = 0;
const playerElement = document.querySelector('.player')
  , bodyElement = document.querySelector('body')
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
    'autoplay': 1,
    'controls': 1,
    'disablekb': 0,
    'fs': 0,
    'iv_load_policy': 3,
    'modestbranding': 1,
    'rel': 0,
    'showinfo': 0
  }
  , playersStatuses = new Map()
  , onReady = identifier => () => {
    const thisStatus = playersStatuses.get(identifier);

    if (!thisStatus.status) {

      playersStatuses.set(identifier, Object.assign(thisStatus, {
        'status': YT.PlayerState.UNSTARTED
      }));
    }
  }
  , switchAudio = () => {
    const unFocused = players.filter(elm => elm !== players[playerFocused])
      , focusedPlayerSelector = `player-${playerFocused}`
      , focusedPlayer = playersStatuses.get(focusedPlayerSelector).player
      , focusedIframe = focusedPlayer.getIframe()
      , playerFocusedInElement = playerElement.querySelector(`#${focusedPlayerSelector}`);

    if (!isPlaying) {

      focusedPlayer.pauseVideo();
      return;
    }

    if (!playerFocusedInElement) {

      for (const playerWasFocus of playerElement.children) {

        playerWasFocus.classList.remove('visible');
        bodyElement.appendChild(playerWasFocus);
      }

      playerElement.appendChild(focusedIframe);
      focusedIframe.classList.add('visible');
    }

    //console.info('play', focusedPlayerSelector, currentTime)
    focusedPlayer.playVideo();
    focusedPlayer.seekTo(currentTime, true);

    unFocused
      .map(aPlayerName => playersStatuses.get(aPlayerName))
      .map(elm => elm.player)
      .forEach(elm => elm.pauseVideo());
  }
  , playerLoop = () => {
    const playersStatusesArray = Array.from(playersStatuses.entries());

    if (playersStatusesArray.length === players.length) {
      const allAreReady = playersStatusesArray
        .map(elm => elm[1])
        .map(elm => elm.status)
        .every(elm => elm === YT.PlayerState.UNSTARTED);

      if (allAreReady &&
        playerFocused !== -1 &&
        isPlaying) {
        const player = playersStatuses.get(`player-${playerFocused}`).player
          , newTime = player.getCurrentTime();

          //console.info(playerFocused, '-', newTime, currentTime);
          if (newTime > currentTime) {

          currentTime = newTime;
          const currentTimeEvent = new window.CustomEvent('player:current-time', {
            'detail': currentTime
          });

          playerElement.dispatchEvent(currentTimeEvent);
        }
      }

      if (!readySent && allAreReady) {
        const playerReady = new window.Event('player:ready');

        readySent = true;
        playerElement.dispatchEvent(playerReady);
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
