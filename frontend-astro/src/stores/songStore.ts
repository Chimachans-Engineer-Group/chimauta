import { atom, computed } from "nanostores";
import type { Track, VideoList } from "../scripts/types";

export const $songList = atom<Track[]>([]);
export const $videoList = atom<VideoList>({});
export const $isLoading = atom<boolean>(true);

export const $entireNum = computed($songList, (list) => list.length);

export function setSongData(songs: Track[], videos: VideoList): void {
  $songList.set(songs);
  $videoList.set(videos);
  $isLoading.set(false);
}
