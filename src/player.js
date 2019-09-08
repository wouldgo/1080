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
  , secondsUpdateInterval = 1
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
  , playerLoop = () => {
    if (playerFocused !== -1 &&
      isPlaying) {
      const player = playersStatuses.get(`player-${playerFocused}`).player
        , newTime = player.getCurrentTime()
        , roundedSeconds = Math.round(newTime);

      currentTime = newTime;
      if (roundedSeconds % secondsUpdateInterval === 0) {
        const progressValue = (player.getCurrentTime() / maxDuration)
          , buffer = player.getVideoLoadedFraction()
          , timeEvent = new window.CustomEvent('player:time', {
            'detail': {
              buffer,
              'progress': Math.abs(Number(progressValue.toFixed(2)))
            }
          });

        bodyElement.dispatchEvent(timeEvent);
      }
    }
  };

animation(playerLoop);

export const nextVideo = () => {
  const newFocus = (playerFocused + 1) % players.length
    , newPlayer = playersStatuses.get(`player-${newFocus}`).player;

  newPlayer.mute();
  newPlayer.seekTo(currentTime, true);
  newPlayer.playVideo();
};

export const prevVideo = () => {
  let newFocus = (playerFocused - 1) % players.length;

  if (newFocus < 0) {

    newFocus = players.length + newFocus;
  }

  const newPlayer = playersStatuses.get(`player-${newFocus}`).player;

  newPlayer.mute();
  newPlayer.seekTo(currentTime, true);
  newPlayer.playVideo();
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

  if (isPlaying) {

    isPlaying = false;
    const thisPlayer = playersStatuses.get(`player-${playerFocused}`).player
      , playStatus = new window.Event('player:paused');

    thisPlayer.pauseVideo();
    thisPlayer.getIframe().classList.remove('visible');
    bodyElement.dispatchEvent(playStatus);
  } else {

    isPlaying = true;
    let thisFocus = playerFocused;

    if (playerFocused === -1) {

      thisFocus = 0;
    }
    const newPlayer = playersStatuses.get(`player-${thisFocus}`).player;

    if (currentTime < 0) {

      newPlayer.seekTo(0, true);
    } else {

      newPlayer.seekTo(currentTime, true);
    }

    newPlayer.playVideo();
  }
};

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

      if (!firstIsReady &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = true && secondIsReady && thirdIsReady;

        firstIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();
        playersStatuses.set(players[0], Object.assign({}, {
          'player': thisPlayer
        }));
        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      } else if (currentTime !== -1 &&
        playerFocused !== 0 &&
        newState === YT.PlayerState.PLAYING) {
        const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
          , playStatus = new window.Event('player:playing');

        oldPlayer.pauseVideo();
        thisPlayer.seekTo(currentTime, true);
        thisPlayer.unMute();

        oldPlayer.getIframe().classList.remove('visible');
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 0;

        bodyElement.dispatchEvent(playStatus);
      } else if (isPlaying &&
        newState === YT.PlayerState.PLAYING) {
        const playStatus = new window.Event('player:playing');

        thisPlayer.unMute();
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 0;

        bodyElement.dispatchEvent(playStatus);
      } else if (newState === YT.PlayerState.ENDED) {

        location.reload();
      } else {

        console.info('0', currentTime, playerFocused, isPlaying, newState);
      }
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

      if (!secondIsReady &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = firstIsReady && true && thirdIsReady;

        secondIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();
        playersStatuses.set(players[1], Object.assign({}, {
          'player': thisPlayer
        }));

        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      } else if (currentTime !== -1 &&
        playerFocused !== 1 &&
        newState === YT.PlayerState.PLAYING) {
        const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
          , playStatus = new window.Event('player:playing');

        oldPlayer.pauseVideo();
        thisPlayer.seekTo(currentTime, true);
        thisPlayer.unMute();

        oldPlayer.getIframe().classList.remove('visible');
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 1;

        bodyElement.dispatchEvent(playStatus);
      } else if (isPlaying &&
        newState === YT.PlayerState.PLAYING) {
        const playStatus = new window.Event('player:playing');

        thisPlayer.unMute();
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 1;

        bodyElement.dispatchEvent(playStatus);
      } else if (newState === YT.PlayerState.ENDED) {

        location.reload();
      } else {

        console.info('1', currentTime, playerFocused, isPlaying, newState);
      }
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

      if (!thirdIsReady &&
        newState === YT.PlayerState.PLAYING) {
        const areWeReady = firstIsReady && secondIsReady && true;

        thirdIsReady = true;
        thisPlayer.pauseVideo();
        thisPlayer.unMute();
        playersStatuses.set(players[2], Object.assign({}, {
          'player': thisPlayer
        }));

        if (areWeReady) {
          const videoReady = new window.Event('player:ready');

          bodyElement.dispatchEvent(videoReady);
        }
      } else if (currentTime !== -1 &&
        playerFocused !== 2 &&
        newState === YT.PlayerState.PLAYING) {
        const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
          , playStatus = new window.Event('player:playing');

        oldPlayer.pauseVideo();
        thisPlayer.seekTo(currentTime, true);
        thisPlayer.unMute();

        oldPlayer.getIframe().classList.remove('visible');
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 2;

        bodyElement.dispatchEvent(playStatus);
      } else if (isPlaying &&
        newState === YT.PlayerState.PLAYING) {
        const playStatus = new window.Event('player:playing');

        thisPlayer.unMute();
        thisPlayer.getIframe().classList.add('visible');
        playerFocused = 2;

        bodyElement.dispatchEvent(playStatus);
      } else if (newState === YT.PlayerState.ENDED) {

        location.reload();
      } else {

        console.info('2', currentTime, playerFocused, isPlaying, newState);
      }
    });
};

bodyElement.addEventListener('controls:skipTo', event => {
  const {detail} = event;

  if (maxDuration !== -1 &&
    isPlaying &&
    detail) {
    const secondsToJump = maxDuration * detail;

    currentTime = secondsToJump;
    players.map(aPlayerName => playersStatuses.get(aPlayerName))
      .filter(elm => elm)
      .map(elm => elm.player)
      .forEach(elm => {

        elm.seekTo(secondsToJump, true);
      });
  }
}, false);
