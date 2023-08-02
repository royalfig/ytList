import { API_KEY } from './config.js';

export async function getVideo(videoIds) {
  try {
    const res = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.join(
        ','
      )}&key=${API_KEY}`
    );

    if (!res.ok) throw new Error('Error fetching video');

    const { items } = await res.json();

    return items;
  } catch (err) {
    throw new Error(err);
  }
}
