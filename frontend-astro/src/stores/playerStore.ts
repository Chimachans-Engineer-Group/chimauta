import { atom, computed } from "nanostores";
import { $songList, $videoList } from "./songStore";
import type { Track, Video } from "../scripts/types";

export const $nowSongNum = atom<number | null>(null);
export const $isPlaying = atom<boolean>(false);
export const $currentTime = atom<number>(0);
export const $duration = atom<number>(0);
export const $isRepeat = atom<boolean>(false);
export const $isShuffle = atom<boolean>(false);
export const $shuffleQueue = atom<number[]>([]);
export const $isMenuOpen = atom<boolean>(false);

export const $currentSong = computed([$songList, $nowSongNum], (list, index): Track | null => {
  if (index === null || !list[index]) return null;
  return list[index];
});

export const $currentVideo = computed([$videoList, $currentSong], (videos, song): Video | null => {
  if (!song || !videos[song.videoId]) return null;
  return videos[song.videoId];
});

export function togglePlay(): void {
  // 外部(YouTubePlayer)からの再生/一時停止トリガーイベント用
  const event = new CustomEvent("chimauta:toggle-play");
  window.dispatchEvent(event);
}

export function playSong(index?: number): void {
  const event = new CustomEvent("chimauta:play-song", {
    detail: { index },
  });
  window.dispatchEvent(event);
}

export function seekTo(seconds: number): void {
  const event = new CustomEvent("chimauta:seek-to", {
    detail: { seconds },
  });
  window.dispatchEvent(event);
}

export function toggleRepeat(): void {
  $isRepeat.set(!$isRepeat.get());
}

export function toggleShuffle(): void {
  const next = !$isShuffle.get();
  $isShuffle.set(next);
  if (!next) {
    $shuffleQueue.set([]);
  } else {
    generateShuffleQueue();
  }
}

export function generateShuffleQueue(): void {
  const songs = $songList.get();
  const current = $nowSongNum.get();
  const queue: number[] = [];

  for (let i = 0; i < songs.length; i++) {
    if (i !== current) {
      queue.push(i);
    }
  }

  // Fisher-Yates shuffle
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }

  $shuffleQueue.set(queue);
}

export function toggleMenu(): void {
  const current = $isMenuOpen.get();
  const next = !current;
  $isMenuOpen.set(next);
  const body = document.querySelector("body");
  if (next) {
    body?.classList.add("open-nav");
  } else {
    body?.classList.remove("open-nav");
  }
}
