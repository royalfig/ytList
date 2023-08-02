import fs from 'fs/promises';
import { getLatestPlaylist } from './getLatestPlaylist.js';
import { getPlaylistItems } from './getPlaylistItems.js';
import { getVideo } from './getVideo.js';
import { createPlaylistElementMarkup, listTemplate } from './templates.js';
import { createSongMarkup } from './util.js';
import { isoDuration, en } from '@musement/iso-duration';
isoDuration.setLocales(
  {
    en,
  },
  {
    fallbackLocale: 'en',
  }
);

async function buildPlaylist() {
  const { id, title, description } = await getLatestPlaylist();
  const playlistUrl = `https://music.youtube.com/playlist?list=${id}`;
  const playlistItems = await getPlaylistItems(id);
  let videoIds = [];

  const songData = playlistItems.map((song, idx) => {
    videoIds.push(song.snippet.resourceId.videoId);
    const songMarkup = createSongMarkup(song, idx);
    return songMarkup;
  });

  const videoData = await getVideo(videoIds);

  const totalDuration = {
    minutes: 0,
    seconds: 0,
  };

  const playListItems = songData.map((el, idx) => {
    const duration = isoDuration(videoData[idx].contentDetails.duration);
    totalDuration.minutes += duration.parse().minutes;
    totalDuration.seconds += duration.parse().seconds;
    el.duration = duration.humanize('en');
    el.vidId = videoData[idx].id;
    el.thumbnail = videoData[idx].snippet.thumbnails.medium.url;
    
    return el;
  });

  const humanReadableDuration = isoDuration(totalDuration)
    .normalize()
    .humanize('en', { largest: 2 });

  const markup = createPlaylistElementMarkup(
    title,
    description,
    playlistUrl,
    playListItems,
    humanReadableDuration,
    videoData
  );

  await fs.writeFile('index.html', markup, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

buildPlaylist();
