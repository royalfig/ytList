import { API_KEY } from './config.js';

export async function getPlaylistItems(playlistId) {
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
