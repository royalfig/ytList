require('dotenv').config();

const API_KEY = process.env.API_KEY;

async function fetchLatestList() {
  //  https://youtube.googleapis.com/youtube/v3/playlists?part=id%2CcontentDetails%2Csnippet&channelId=UCa_0Tn_aYic-2d4XRr75Mtg&key=[YOUR_API_KEY]
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlists?part=id,snippet&channelId=UCa_0Tn_aYic-2d4XRr75Mtg&key=${API_KEY}&maxResults=1`
    );

    if (!res.ok) {
      throw Error(res.statusText);
    }

    const { items } = await res.json();

    return {
      id: items[0].id,
      title: items[0].snippet.title,
      description: items[0].snippet.description,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getPlaylistItems(playlistId) {
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/playlistItems?part=id%2Csnippet%2Cstatus&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
    );

    if (!res.ok) {
      throw Error(res.statusText);
    }

    const { items } = await res.json();
    return items;
  } catch (error) {
    console.log(error);
  }
}

function createSongLink(id) {
  return `https://music.youtube.com/watch?v=${id}`;
}

function formatArtistAndAlbum(str) {
  if (!str.includes(' - ')) return { artist: str.trim(), album: '' };

  const [artist, album] = str.split('-');
  return {
    artist: artist.trim(),
    album: album.trim(),
  };
}

function listTemplate(title, artist, songLink, url, idx ) {
  return `
    <div class="sm-playlist-item">
        <p class="sm-playlist-item-number">${idx + 1}</p>
        <img src="${url}" alt="${title}" />
        <div class="sm-playlist-item-info">
            <a class="sm-playlist-item-title" href="${songLink}" target="_blank">${title}</a>
            <p class="sm-playlist-item-artist">${artist}</p>
        </div>
    </div>`;
}

function createSongMarkup(item, idx) {
  const {
    snippet: {
      title,
      thumbnails: {
        default: { url },
      },
      videoOwnerChannelTitle,
      resourceId: { videoId },
    },
  } = item;

  const songLink = createSongLink(videoId);
  const { artist, album } = formatArtistAndAlbum(videoOwnerChannelTitle);

  const markup = listTemplate(title, artist, songLink, url, idx );

  return markup;
}

function createPlaylistElementMarkup(title, description, link, items) {
  return `
    <div class="sm-playlist">
        <div class="sm-playlist-header">
            <p class="sm-playlist-title">${title}</p>
            <p class="sm-playlist-description">${description}</p>
            <a class="sm-icon-button" href="${link}" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-collection-play-fill" viewBox="0 0 16 16">
            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm6.258-6.437a.5.5 0 0 1 .507.013l4 2.5a.5.5 0 0 1 0 .848l-4 2.5A.5.5 0 0 1 6 12V7a.5.5 0 0 1 .258-.437z"/>
          </svg> Play</a>
        </div>
        
        ${items.join('')}
        
    </div>`;
}

async function buildPlaylist() {
  const { id, title, description } = await fetchLatestList();
  const playlistUrl = `https://music.youtube.com/playlist?list=${id}`;
  const playlistItems = await getPlaylistItems(id);

  const playListItemMarkup = playlistItems.map((song,idx) => createSongMarkup(song,idx));
  const markup = createPlaylistElementMarkup(
    title,
    description,
    playlistUrl,
    playListItemMarkup
  );
  console.log(markup);
}

buildPlaylist();
