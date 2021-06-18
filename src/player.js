import {animation} from './interaction.js';

const bodyElement = document.querySelector('body')
  , onStateChangeEventSym = Symbol.for('player:onStateChangeEvent')
  , onReadyEventSym = Symbol.for('player:onReadyEvent')
  , playersSym = Symbol.for('player:players')
  , focusedPlayerSym = Symbol.for('player:focusedPlayer')
  , maxDurationSym = Symbol.for('player:maxDuration')
  , currentTimeSym = Symbol.for('player:currentTime')
  , areAllReadySym = Symbol.for('player:areAllReady')
  , isPlayingSym = Symbol.for('player:isPlaying')
  , resolution = [800, 600]
  , videoIds = [
      'C_wHUR7mc_Y', //'eG40LruCHUg', //'FT3nzUgg7Dc',
      'uuMG-GQWTJA', //'IxC_HrXo5mk', //'BKrvWejrJtA',
      '0RiIgoTuzAg'//'IR60mlkSiwo' //'bC02qDo9E3I'
    ]
  , somethingFailed = err => {
      console.error('Something failed', err);
    }
  , weAreAllReady = () => {
    const videoReady = new window.Event('player:ready');

    bodyElement.dispatchEvent(videoReady);
  };

class MergedVideos {
  constructor() {
    MergedVideos[playersSym] = {};
    MergedVideos[focusedPlayerSym] = 'player-0';
    MergedVideos[isPlayingSym] = false;
    MergedVideos[maxDurationSym] = -1;
    MergedVideos[currentTimeSym] = -1;
    MergedVideos[areAllReadySym] = new Promise((resolve, reject) => {
      setTimeout(() => reject('timeout'), 60000);
      const stopIt = animation(() => {

        if (Object.keys(MergedVideos[playersSym]).length === videoIds.length) {

          stopIt();
          return resolve();
        }
      });
    })
    .then(weAreAllReady, somethingFailed);
  }

  static [onReadyEventSym](event) {
    const thisPlayer = event.target
      , thisDuration = thisPlayer.getDuration();

    thisPlayer.setPlaybackQuality('hd1080');
    thisPlayer.mute();
    thisPlayer.playVideo();
    if (thisDuration > MergedVideos[maxDurationSym]) {

      MergedVideos[maxDurationSym] = thisDuration;
    }
  }

  static [onStateChangeEventSym](event) {
    const newState = event.data
      , thisPlayer = event.target
      , currentTime = MergedVideos[currentTimeSym]
      , focusedPlayer = MergedVideos[focusedPlayerSym]
      , allPlayers = Object.entries(MergedVideos[playersSym])
      , element = thisPlayer.getIframe()
      , me = thisPlayer.getIframe().id;

    console.info(me, newState, YT.PlayerState);
    if (allPlayers.length !== videoIds.length && newState === YT.PlayerState.BUFFERING) {

      MergedVideos[playersSym][me] = thisPlayer;
      thisPlayer.pauseVideo();
    }

    if (newState === YT.PlayerState.PLAYING) {
      if (focusedPlayer === me) {

        if (currentTime !== -1) {

          thisPlayer.seekTo(currentTime, true);
        }
        thisPlayer.unMute();
        thisPlayer.playVideo();

        for (let index = 0; index < allPlayers.length; index += 1) {
          const [playerName, player] = allPlayers[index];

          if (playerName === focusedPlayer) {

            element.classList.add('visible');
          } else {
            player.getIframe().classList.remove('visible');
          }
        }
      } else {

        thisPlayer.mute();
        thisPlayer.pauseVideo();
      }
    }

    // if (newState === YT.PlayerState.PLAYING) {
    //   thisPlayer.pauseVideo();
    //
    // } else if (newState === YT.PlayerState.PLAYING &&
    //   currentTime !== -1 && focusedPlayer !== me) {
    //     debugger;
    //   const oldPlayer = MergedVideos[playersSym]
    //     , playStatus = new window.Event('player:playing');

    //   oldPlayer.pauseVideo();
    //   thisPlayer.seekTo(currentTime, true);
    //   thisPlayer.unMute();

    //   oldPlayer.getIframe().classList.remove('visible');
    //   element.classList.add('visible');
    //   MergedVideos[focusedPlayerSym] = me;

    //   bodyElement.dispatchEvent(playStatus);
    // } else if (newState === YT.PlayerState.PLAYING &&
    //   MergedVideos[isPlayingSym]) {
    //     debugger;
    //   const playStatus = new window.Event('player:playing');

    //   thisPlayer.unMute();
    //   element.classList.add('visible');
    //   MergedVideos[focusedPlayerSym] = me;

    //   bodyElement.dispatchEvent(playStatus);
    // } else if (newState === YT.PlayerState.ENDED) {

    //   location.reload();
    // } else {

    //   console.info(me, currentTime, MergedVideos[focusedPlayerSym], MergedVideos[isPlayingSym], newState);
    // }
  }

  onYouTubeIframeAPIReady() {
    for (let index = 0; index < videoIds.length; index += 1) {
      const aVideoId = videoIds[index]
        , aPlayerName = `player-${index}`
        , aPlayer = new YT.Player(aPlayerName, {
          'height': resolution[1],
          'width': resolution[0],
          'videoId': aVideoId,
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

      aPlayer.addEventListener('onReady', MergedVideos[onReadyEventSym]);
      aPlayer.addEventListener('onStateChange', MergedVideos[onStateChangeEventSym]);
    }
  }

  async play() {
    await MergedVideos[areAllReadySym];
    const thisPlayer = MergedVideos[playersSym][MergedVideos[focusedPlayerSym]];

    let playStatus;

    if (MergedVideos[isPlayingSym]) {

      playStatus = new window.Event('player:paused');
      thisPlayer.pauseVideo();
      thisPlayer.getIframe().classList.remove('visible');
      MergedVideos[isPlayingSym] = false;
    } else {

      playStatus = new window.Event('player:playing');
      if (MergedVideos[currentTimeSym] < 0) {

        thisPlayer.seekTo(0, true);
      } else {

        thisPlayer.seekTo(MergedVideos[currentTimeSym], true);
      }

      thisPlayer.playVideo();
      MergedVideos[isPlayingSym] = true;
    }


    bodyElement.dispatchEvent(playStatus);
  }

  async nextVideo() {
    console.info('nextVideo');
  }
  async prevVideo() {
    console.info('prevVideo');
  }
  async restart() {
    console.info('restart');
  }
}

export const player = new MergedVideos();

window.onYouTubeIframeAPIReady = player.onYouTubeIframeAPIReady;

// let isPlaying = false
//   , currentTime = -1
//   , maxDuration = -1;
// const bodyElement = document.querySelector('body')
//   , videoPlayers = (() => {
//       const playersStatuses = new Map()
//         , resolution = [800, 600]
//         , players = [
//           'player-0',
//           'player-1',
//           'player-2'
//         ]
//       , videoIds = [
//         'C_wHUR7mc_Y', //'eG40LruCHUg', //'FT3nzUgg7Dc',
//         'uuMG-GQWTJA', //'IxC_HrXo5mk', //'BKrvWejrJtA',
//         '0RiIgoTuzAg'//'IR60mlkSiwo' //'bC02qDo9E3I'
//       ];

//       let firstIsReady = false
//         , secondIsReady = false
//         , thirdIsReady = false
//         , playerFocused = -1;

//       return {
//         'seekTo': secondsToJump => {

//           for (let index = 0; index < players.length; index += 1) {
//             const aPlayerName = players[index]
//               , aPlayer = playersStatuses.get(aPlayerName);

//             if (aPlayer != null &&
//               aPlayer.player != null) {

//               aPlayer.seekTo(secondsToJump, true);
//             }
//           }
//         },
//         'restart': () => {

//           for (let index = 0; index < players.length; index += 1) {
//             const aPlayerName = players[index]
//               , aPlayer = playersStatuses.get(aPlayerName);

//             if (aPlayer != null &&
//               aPlayer.player != null) {

//               aPlayer.seekTo(0, true);
//             }
//           }
//         },
//         'current': () => {
//           let thisFocus = playerFocused;

//           if (playerFocused === -1) {

//             thisFocus = 0;
//           }
//           return playersStatuses.get(`player-${thisFocus}`).player;
//         },
//         'next': () => {
//           const newFocus = (playerFocused + 1) % players.length;

//           return playersStatuses.get(`player-${newFocus}`).player;
//         },
//         'prev': () => {
//           let newFocus = (playerFocused - 1) % players.length;

//           if (newFocus < 0) {

//             newFocus = players.length + newFocus;
//           }

//           return playersStatuses.get(`player-${newFocus}`).player;
//         },
//         'onYouTubeIframeAPIReady': () => {
//           const player1 = new YT.Player(players[0], {
//               'height': resolution[1],
//               'width': resolution[0],
//               'videoId': videoIds[0],
//               'playerVars': {
//                 'origin': document.domain,
//                 'controls': 0,
//                 'disablekb': 1,
//                 'fs': 0,
//                 'iv_load_policy': 3,
//                 'modestbranding': 1,
//                 'rel': 0,
//                 'showinfo': 0
//               }
//             })
//             , player2 = new YT.Player(players[1], {
//               'height': resolution[1],
//               'width': resolution[0],
//               'videoId': videoIds[1],
//               'playerVars': {
//                 'origin': document.domain,
//                 'controls': 0,
//                 'disablekb': 1,
//                 'fs': 0,
//                 'iv_load_policy': 3,
//                 'modestbranding': 1,
//                 'rel': 0,
//                 'showinfo': 0
//               }
//             })
//             , player3 = new YT.Player(players[2], {
//               'height': resolution[1],
//               'width': resolution[0],
//               'videoId': videoIds[2],
//               'playerVars': {
//                 'origin': document.domain,
//                 'controls': 0,
//                 'disablekb': 1,
//                 'fs': 0,
//                 'iv_load_policy': 3,
//                 'modestbranding': 1,
//                 'rel': 0,
//                 'showinfo': 0
//               }
//             });

//             player1.addEventListener('onReady', event => {
//               const thisPlayer = event.target
//                 , thisDuration = thisPlayer.getDuration();

//               thisPlayer.setPlaybackQuality('hd1080');
//               thisPlayer.mute();
//               thisPlayer.playVideo();
//               if (thisDuration > maxDuration) {

//                 maxDuration = thisDuration;
//               }
//             });
//             player1.addEventListener('onStateChange', event => {
//               const newState = event.data
//                 , thisPlayer = event.target;

//               if (!firstIsReady &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const areWeReady = secondIsReady && thirdIsReady;

//                 firstIsReady = true;
//                 thisPlayer.pauseVideo();
//                 thisPlayer.unMute();
//                 playersStatuses.set(players[0], {
//                   'player': thisPlayer
//                 });
//                 if (areWeReady) {
//                   const videoReady = new window.Event('player:ready');

//                   bodyElement.dispatchEvent(videoReady);
//                 }
//               } else if (currentTime !== -1 &&
//                 playerFocused !== 0 &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
//                   , playStatus = new window.Event('player:playing');

//                 oldPlayer.pauseVideo();
//                 thisPlayer.seekTo(currentTime, true);
//                 thisPlayer.unMute();

//                 oldPlayer.getIframe().classList.remove('visible');
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 0;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (isPlaying &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const playStatus = new window.Event('player:playing');

//                 thisPlayer.unMute();
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 0;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (newState === YT.PlayerState.ENDED) {

//                 location.reload();
//               } else {

//                 console.info('0', currentTime, playerFocused, isPlaying, newState);
//               }
//             });

//             player2.addEventListener('onReady', event => {
//               const thisPlayer = event.target
//                 , thisDuration = thisPlayer.getDuration();

//               thisPlayer.setPlaybackQuality('hd1080');
//               thisPlayer.mute();
//               thisPlayer.playVideo();
//               if (thisDuration > maxDuration) {

//                 maxDuration = thisDuration;
//               }
//             });
//             player2.addEventListener('onStateChange', event => {
//               const newState = event.data
//                 , thisPlayer = event.target;

//               if (!secondIsReady &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const areWeReady = firstIsReady && thirdIsReady;

//                 secondIsReady = true;
//                 thisPlayer.pauseVideo();
//                 thisPlayer.unMute();
//                 playersStatuses.set(players[1], {
//                   'player': thisPlayer
//                 });

//                 if (areWeReady) {
//                   const videoReady = new window.Event('player:ready');

//                   bodyElement.dispatchEvent(videoReady);
//                 }
//               } else if (currentTime !== -1 &&
//                 playerFocused !== 1 &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
//                   , playStatus = new window.Event('player:playing');

//                 oldPlayer.pauseVideo();
//                 thisPlayer.seekTo(currentTime, true);
//                 thisPlayer.unMute();

//                 oldPlayer.getIframe().classList.remove('visible');
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 1;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (isPlaying &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const playStatus = new window.Event('player:playing');

//                 thisPlayer.unMute();
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 1;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (newState === YT.PlayerState.ENDED) {

//                 location.reload();
//               } else {

//                 console.info('1', currentTime, playerFocused, isPlaying, newState);
//               }
//             });

//             player3.addEventListener('onReady', event => {
//               const thisPlayer = event.target
//                 , thisDuration = thisPlayer.getDuration();

//               thisPlayer.setPlaybackQuality('hd1080');
//               thisPlayer.mute();
//               thisPlayer.playVideo();
//               if (thisDuration > maxDuration) {

//                 maxDuration = thisDuration;
//               }
//             });
//             player3.addEventListener('onStateChange', event => {
//               const newState = event.data
//                 , thisPlayer = event.target;

//               if (!thirdIsReady &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const areWeReady = firstIsReady && secondIsReady && true;

//                 thirdIsReady = true;
//                 thisPlayer.pauseVideo();
//                 thisPlayer.unMute();
//                 playersStatuses.set(players[2], {
//                   'player': thisPlayer
//                 });

//                 if (areWeReady) {
//                   const videoReady = new window.Event('player:ready');

//                   bodyElement.dispatchEvent(videoReady);
//                 }
//               } else if (currentTime !== -1 &&
//                 playerFocused !== 2 &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const oldPlayer = playersStatuses.get(`player-${playerFocused}`).player
//                   , playStatus = new window.Event('player:playing');

//                 oldPlayer.pauseVideo();
//                 thisPlayer.seekTo(currentTime, true);
//                 thisPlayer.unMute();

//                 oldPlayer.getIframe().classList.remove('visible');
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 2;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (isPlaying &&
//                 newState === YT.PlayerState.PLAYING) {
//                 const playStatus = new window.Event('player:playing');

//                 thisPlayer.unMute();
//                 thisPlayer.getIframe().classList.add('visible');
//                 playerFocused = 2;

//                 bodyElement.dispatchEvent(playStatus);
//               } else if (newState === YT.PlayerState.ENDED) {

//                 location.reload();
//               } else {

//                 console.info('2', currentTime, playerFocused, isPlaying, newState);
//               }
//             });
//         }
//       };
//     })()
//   , playerLoop = () => {
//     if (isPlaying) {
//       const player = videoPlayers.current()
//         , newTime = player.getCurrentTime()
//         , roundedSeconds = Math.round(newTime)
//         , changed = Math.ceil(newTime) - Math.ceil(currentTime) > 0;

//       currentTime = newTime;
//       if (changed) {
//         const progressValue = (newTime / maxDuration)
//           , buffer = player.getVideoLoadedFraction()
//           , timeEvent = new window.CustomEvent('player:time', {
//             'detail': {
//               buffer,
//               'progress': Math.abs(Number(progressValue.toFixed(2))),
//               'currentTime': roundedSeconds,
//               'duration': maxDuration
//             }
//           });

//         bodyElement.dispatchEvent(timeEvent);
//       }
//     }
//   };

// animation(playerLoop);

// export const nextVideo = () => {
//   const newPlayer = videoPlayers.next();

//   newPlayer.mute();
//   newPlayer.seekTo(currentTime, true);
//   newPlayer.playVideo();
// };

// export const prevVideo = () => {
//   const newPlayer = videoPlayers.prev();

//   newPlayer.mute();
//   newPlayer.seekTo(currentTime, true);
//   newPlayer.playVideo();
// };

// export const restart = () => {
//   currentTime = -1;
//   const timeEvent = new window.CustomEvent('player:time', {
//     'detail': 0
//   });

//   bodyElement.dispatchEvent(timeEvent);
//   videoPlayers.restart();
// };

// export const play = () => {
//   if (isPlaying) {

//     isPlaying = false;
//     const thisPlayer = videoPlayers.current()
//       , playStatus = new window.Event('player:paused');

//     thisPlayer.pauseVideo();
//     thisPlayer.getIframe().classList.remove('visible');
//     bodyElement.dispatchEvent(playStatus);
//   } else {

//     isPlaying = true;
//     const newPlayer = videoPlayers.current();

//     if (currentTime < 0) {

//       newPlayer.seekTo(0, true);
//     } else {

//       newPlayer.seekTo(currentTime, true);
//     }

//     newPlayer.playVideo();
//   }
// };

// window.onYouTubeIframeAPIReady = videoPlayers.onYouTubeIframeAPIReady;

// bodyElement.addEventListener('controls:skipTo', event => {
//   const {detail} = event;

//   if (maxDuration !== -1 &&
//     isPlaying &&
//     detail) {
//     const secondsToJump = maxDuration * detail;

//     currentTime = secondsToJump;
//     videoPlayers.seekTo(secondsToJump);
//   }
// }, false);
