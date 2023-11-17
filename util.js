export function createSongLink(id) {
  return `https://music.youtube.com/watch?v=${id}`;
}

export function formatArtistAndAlbum(str) {
  if (!str.includes(" - ")) return { artist: str.trim(), album: "" };
  const [artist, album] = str.split("-");
  return {
    artist: artist.trim(),
    album: album.trim(),
  };
}

export function createSongMarkup(item, idx) {
  if (item.status?.privacyStatus === "private") throw new Error("Private video. Check your playlist.", item);
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
  return { title, artist, songLink, url, idx, id: videoId };
}
