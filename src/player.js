import {animation} from './interaction.js';

let firstIsReady = false
  , secondIsReady = false
  , thirdIsReady = false
  , playerFocused = -1
  , isPlaying = false
  , currentTime = -1
  , maxDuration = -1;
const bodyElement = document.querySelector('body')
  , resolution = [1024, 768]
  , secondsUpdateInterval = 3
  , players = [
    'player-0',
    'player-1',
    'player-2'
  ]
  , videoIds = [
    'FT3nzUgg7Dc',
    'BKrvWejrJtA',
    'bC02qDo9E3I'
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
        if (currentTime < 0) {

          elm.seekTo(1, true);
        } else {

          elm.seekTo(currentTime, true);
        }

        return elm;
      })
      .forEach(elm => elm.pauseVideo());

    if (!isPlaying) {

      focusedPlayer.getIframe().classList.remove('visible');
      focusedPlayer.pauseVideo();
      return;
    }

    focusedIframe.classList.add('visible');

    if (currentTime > focusedPlayer.getCurrentTime()) {

      focusedPlayer.seekTo(currentTime, true);
    }

    focusedPlayer.playVideo();
  }
  , playerLoop = () => {
    if (playerFocused !== -1 &&
      isPlaying) {
      const player = playersStatuses.get(`player-${playerFocused}`).player
        , newTime = player.getCurrentTime();

      if (newTime > currentTime) {
        const roundedSeconds = Math.round(newTime);

        currentTime = newTime;
        if (roundedSeconds % secondsUpdateInterval === 0) {
          const bufferValue = (player.getCurrentTime() / maxDuration)
            , timeEvent = new window.CustomEvent('player:time', {
              'detail': Math.abs(Number(bufferValue.toFixed(2)))
            });

          bodyElement.dispatchEvent(timeEvent);

          /*players.filter(elm => elm !== players[playerFocused])
            .map(aPlayerName => playersStatuses.get(aPlayerName))
            .filter(elm => elm)
            .map(elm => elm.player)
            .forEach(elm => {

              elm.seekTo(currentTime, true);
            });*/
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
        'origin': document.domain,
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
        'origin': document.domain,
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
        'origin': document.domain,
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
      const thisPlayer = event.target
        , thisDuration = thisPlayer.getDuration();

      thisPlayer.setPlaybackQuality('hd1080');
      thisPlayer.mute();
      thisPlayer.playVideo();
      if (thisDuration > maxDuration) {

        maxDuration = thisDuration;
      }
    });
    player1.addEventListener('onStateChange', event => {
      const newState = event.data
        , thisPlayer = event.target;

      if (currentTime === -1 &&
        playerFocused === -1 &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = true && secondIsReady && thirdIsReady;

        firstIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();
        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      }
      playersStatuses.set(players[0], Object.assign({}, {
        'player': player1
      }));
    });

    player2.addEventListener('onReady', event => {
      const thisPlayer = event.target
        , thisDuration = thisPlayer.getDuration();

      thisPlayer.setPlaybackQuality('hd1080');
      thisPlayer.mute();
      thisPlayer.playVideo();
      if (thisDuration > maxDuration) {

        maxDuration = thisDuration;
      }
    });
    player2.addEventListener('onStateChange', event => {
      const newState = event.data
        , thisPlayer = event.target;

      if (currentTime === -1 &&
        playerFocused === -1 &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = firstIsReady && true && thirdIsReady;

        secondIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();

        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      }
      playersStatuses.set(players[1], Object.assign({}, {
        'player': player2
      }));
    });

    player3.addEventListener('onReady', event => {
      const thisPlayer = event.target
        , thisDuration = thisPlayer.getDuration();

      thisPlayer.setPlaybackQuality('hd1080');
      thisPlayer.mute();
      thisPlayer.playVideo();
      if (thisDuration > maxDuration) {

        maxDuration = thisDuration;
      }
    });
    player3.addEventListener('onStateChange', event => {
      const newState = event.data
        , thisPlayer = event.target;

      if (currentTime === -1 &&
        playerFocused === -1 &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = firstIsReady && secondIsReady && true;

        thirdIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();

        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      }
      playersStatuses.set(players[2], Object.assign({}, {
        'player': player3
      }));
    });
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

export const restart = () => {
  currentTime = -1;
  const timeEvent = new window.CustomEvent('player:time', {
    'detail': 0
  });

  bodyElement.dispatchEvent(timeEvent);
  players
    .map(aPlayerName => playersStatuses.get(aPlayerName))
    .filter(elm => elm)
    .map(elm => elm.player)
    .forEach(elm => {
      elm.seekTo(0, true);
    });
};

export const play = () => {
  let playStatus;

  if (isPlaying) {

    isPlaying = false;
    playStatus = new window.Event('player:paused');
  } else {

    isPlaying = true;
    playStatus = new window.Event('player:playing');
    if (playerFocused === -1) {

      playerFocused = 0;
    }
  }

  bodyElement.dispatchEvent(playStatus);
  return switchAudio();
};

window.players = playersStatuses;
