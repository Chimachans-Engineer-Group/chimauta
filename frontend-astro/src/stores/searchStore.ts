import { atom, map, computed } from "nanostores";
import { $songList, $videoList } from "./songStore";

export interface SearchOptions {
  songTitle: boolean;
  artist: boolean;
  videoTitle: boolean;
  postDate: boolean;
}

export const $query = atom<string>("");
export const $searchOptions = map<SearchOptions>({
  songTitle: true,
  artist: true,
  videoTitle: false,
  postDate: false,
});

export const $filteredIndices = atom<number[]>([]);
export const $searchResultNum = computed($filteredIndices, (indices) => indices.length);

export function filterSongs(keyword: string): void {
  $query.set(keyword);
  const songs = $songList.get();
  const options = $searchOptions.get();
  const videos = $videoList.get();

  const trimmed = keyword.trim();
  if (trimmed === "") {
    $filteredIndices.set(songs.map((_, i) => i));
    return;
  }

  // 正規表現エスケープ
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  const results: number[] = [];
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    let match = false;

    if (options.songTitle && regex.test(song.title)) {
      match = true;
    } else if (options.artist && regex.test(song.artist)) {
      match = true;
    } else if (options.videoTitle && videos[song.videoId] && regex.test(videos[song.videoId].title)) {
      match = true;
    } else if (options.postDate && videos[song.videoId] && regex.test(videos[song.videoId].postDate)) {
      match = true;
    }

    if (match) {
      results.push(i);
    }
  }

  $filteredIndices.set(results);
}
