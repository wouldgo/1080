import {animation} from './interaction.js';

const playerElement = document.querySelector('#player')
  , resolution = [640, 480]
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
  , onStateChange = identifier => event => {
    const thisStatus = playersStatuses.get(identifier);

    playersStatuses.set(identifier, Object.assign(thisStatus, {
      'status': event.data
    }));

    if (event.data === YT.PlayerState.UNSTARTED) {

      thisStatus.player.seekTo(0);
    }
    console.info(event.data);
  }
  , playerLoop = () => {
    const allAreReady = Array.from(playersStatuses.values())
      .every(elm => elm.status === YT.PlayerState.PAUSED);

    if (allAreReady) {


    }
  };

animation(playerLoop);
window.onYouTubeIframeAPIReady = () => {
  const player1 = new YT.Player('player-1', {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[0],
      playerVars,
      'events': {
        'onStateChange': onStateChange('player-1')
      }
    })
    , player2 = new YT.Player('player-2', {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[1],
      playerVars,
      'events': {
        'onStateChange': onStateChange('player-2')
      }
    })
    , player3 = new YT.Player('player-3', {
      'height': resolution[1],
      'width': resolution[0],
      'videoId': videoIds[2],
      playerVars,
      'events': {
        'onStateChange': onStateChange('player-3')
      }
    });

    playersStatuses.set('player-1', Object.assign({}, {
      'player': player1
    }));
    playersStatuses.set('player-2', Object.assign({}, {
      'player': player2
    }));
    playersStatuses.set('player-3', Object.assign({}, {
      'player': player3
    }));
};

tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];

firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

export const nextVideo = () => {

  console.info('next');
};

export const prevVideo = () => {

  console.info('prev');
};

export const play = () => {

  console.info('play');
};
