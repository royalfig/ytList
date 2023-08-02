export function createPlaylistElementMarkup(
  title,
  description,
  link,
  playListItems,
  humanReadableDuration,
  videoData
) {
  const songs = playListItems.map((song, idx) => {
    console.log(song)
    return listTemplate(song, idx);
  });

  return `
  
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
    <div class="sm-playlist">
      <div class="sm-playlist-items"> 
        <header class="sm-playlist-header">
            <p class="sm-playlist-title">${title}</p>
            <p class="sm-playlist-duration">${
              playListItems.length
            } Tracks / ${humanReadableDuration}</p>
            <p class="sm-playlist-description">${description}</p>
            <a class="sm-icon-button" href="${link}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-collection-play-fill" viewBox="0 0 16 16">
            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
          </svg> Play</a>
        </header>
        
        ${songs.join('')}
      </div>
      <div class="sm-playlist-content" id="player">

      </div>  
    </div>

    <script>
   
      const playerContainer = document.querySelector('.sm-playlist-content');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const buttons = document.querySelectorAll('.sm-playlist-item');

      document.head.append(tag);

      function onYouTubeIframeAPIReady() {
        const player = new YT.Player('player', {
          height: '360',
          width: '640',
          playerVars: {
            modestbranding: 1,
            enablejsapi: 1,
            list: 'PLnPe3mrvTpEzNINsV2kNqY_LTeNkdprdL',
            listType: 'playlist',
          },

          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });

        function onPlayerReady() {
          buttons.forEach((button) => {
            button.addEventListener('click', () => {
              currentSong = button.dataset.idx;
           
              player.playVideoAt(currentSong);
            });
          });
        }

        function onPlayerStateChange(event) {
          let int;
          if (event.data === 1) {
          const currentSongIndex = player.getPlaylistIndex();
          const currentSong = document.querySelector('button[data-idx="0"]');
            int = setInterval(() => {
            
              const ratio = (player.getCurrentTime() / player.getDuration());
              currentSong.style.background = \`linear-gradient(to right, #e74c3c \${ratio * 100}%, #fff \${ratio * 100}%)\`;
              
            }, 500);
          } else {
            clearInterval(int);
        }
      }
    </script>
    </body>
    </html>`;
}

export function listTemplate({ title, artist, id, thumbnail, idx, duration }) {
  return `
    <button class="sm-playlist-item" data-src="${id}" data-idx="${idx}">
        <p class="sm-playlist-item-number">${idx + 1}</p>
        <img src="${thumbnail}" alt="${title}" />
        <div class="sm-playlist-item-info">
            <p class="sm-playlist-item-title">${title}</p>
            <p class="sm-playlist-item-artist">${artist}</p>
            <p class="sm-playlist-item-duration">${duration}</p>
        </div>
    </button>`;
}
