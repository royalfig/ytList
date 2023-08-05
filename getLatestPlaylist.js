import { API_KEY } from "./config.js";

export async function getLatestPlaylist() {
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
