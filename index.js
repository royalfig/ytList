import fs from "fs/promises";
import { getLatestPlaylist } from "./getLatestPlaylist.js";
import { getPlaylistItems } from "./getPlaylistItems.js";
import { getVideo } from "./getVideo.js";
import { createPlaylistElementMarkup } from "./templates.js";
import { createSongMarkup } from "./util.js";
import { isoDuration, en } from "@musement/iso-duration";
import { getColor } from "colorthief";

isoDuration.setLocales(
  {
    en,
  },
  {
    fallbackLocale: "en",
  }
);

async function buildPlaylist() {
  const { id, title } = await getLatestPlaylist();
  const playlistUrl = `https://music.youtube.com/playlist?list=${id}`;
  const playlistItems = await getPlaylistItems(id);
  console.log(JSON.stringify(playlistItems, null, 2))
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

  const playListPromises = Promise.all(
    songData.map(async (el, idx) => {
      const durationTimestamp = videoData[idx].contentDetails.duration;
      const duration = isoDuration(durationTimestamp);
      const minutes = duration.parse().minutes;
      const seconds = duration.parse().seconds;
      totalDuration.minutes += minutes;
      totalDuration.seconds += seconds;
      el.duration = duration.humanize("en");
      el.vidId = videoData[idx].id;
      el.thumbnail = videoData[idx].snippet.thumbnails.maxres.url;
      const [r, g, b] = await getColor(el.thumbnail);
      el.color = `rgb(${r},${g},${b})`;
      el.timestamp = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      return el;
    })
  );

  const playListItems = await playListPromises;

  const humanReadableDuration = isoDuration(totalDuration)
    .normalize()
    .humanize("en", { largest: 2 });

  const markup = createPlaylistElementMarkup(
    title,
    playlistUrl,
    playListItems,
    humanReadableDuration,
    videoData,
    id
  );

  try {
    await fs.writeFile("index.html", markup);
    console.log("Playlist built!");
  } catch (error) {
    console.log(error);
  }
}

buildPlaylist();
