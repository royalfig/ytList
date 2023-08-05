export function createPlaylistElementMarkup(
  title,
  link,
  playListItems,
  humanReadableDuration,
  videoData,
  id
) {
  const songs = playListItems.map((song, idx) => {
    return listTemplate(song, idx);
  });

  return `
  <section class="sm-playlist-grid" data-playlist-id="${id}">
    <div class="sm-playlist-text">
        <h3><a href="${link}" target="_blank">${title}</a></h3>
        <p>${playListItems.length} Tracks / ${humanReadableDuration}</p>
        <ol class="sm-playlist-page sm-playlist-active">
          ${songs.join("")}
        </ol>
    </div>
    <div class="sm-playlist-controls">
      <div class="sm-playlist-cover-art" style="background-image: url(${
        playListItems[0].thumbnail
      })"></div>
      <div class="sm-playlist-now-playing">
        <p>${playListItems[0].title}</p>
        <p>${playListItems[0].artist}</p>
      </div>

      <div class="sm-playlist-buttons">
        <button class="sm-playlist-button" data-control="previous" aria-label="Previous track">
          <svg aria-hidden='true'>
          <use href='#sm-back-icon'></use>
          </svg>
        </button>
        
        <button class="sm-playlist-button" data-control="play" aria-label="play">
          <svg aria-hidden='true'>
          <use href='#sm-play-icon'></use>
          </svg>
        </button>

        <button class="sm-playlist-button" data-control="pause" aria-label="pause">
          <svg aria-hidden='true'>
          <use href='#sm-pause-icon'></use>
          </svg>
        </button>

        <button class="sm-playlist-button" data-control="forward" aria-label="forward">
          <svg aria-hidden='true'>
          <use href='#sm-forward-icon'></use>
          </svg>
        </button>
      </div>

      <div class="sm-playlist-progress" data-volume="high">
        <span class="sm-start-time">0:00</span>
        <span class="sm-end-time">${playListItems[0].timestamp}</span>
        <input type="range" id="progress" name="progress" min="0" max="100" value="100" />
      </div>

      <div class="sm-playlist-volume" data-volume="high">
        <span class="sm-muted"><svg aria-label="muted" aria-hidden="true"><use href="#sm-mute-icon"></use></svg></span>
        <span class="sm-low-volume"><svg aria-label="volume low" aria-hidden="true"><use href="#sm-volume-down"></use></svg></span>
        <span class="sm-high-volume"><svg aria-label="volume high" aria-hidden="true"><use href="#sm-volume-up"></use></svg></span>
        <input type="range" id="volume" name="volume" min="0" max="100" value="100" />
      </div>
    

    </div>
    <div class="sm-playlist-iframe" id="player"></div>
  </section>`;
}

export function listTemplate({
  title,
  artist,
  id,
  thumbnail,
  idx,
  timestamp,
  color,
}) {
  return `
  <li data-track="${(idx + 1).toString().padStart(2, "0")}" data-marker="▸">
    <button class="sm-playlist-item" data-src="${id}" data-idx="${idx}" data-image-src="${thumbnail}" data-artist="${artist}" data-title="${title}" data-timestamp="${timestamp}" data-color="${color}">
        <span class="sm-playlist-item-title">${title}</span>
        <span class="sm-playlist-item-artist">${artist}</span>
    </button>
  </li>`;
}
