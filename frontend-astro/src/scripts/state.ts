import type { Track, VideoList } from "./types";

class AppState {
  songList: Track[] = [];
  videoList: VideoList = {};
  searchResult: number[] = [];
  nowSongNum: number | null = null;
  prevSongNum: number | null = null;
  wholeSeconds: number = 0;
  countUpSecondsInterval: ReturnType<typeof setInterval> | null = null;
  countUpSecondsFlag: boolean = false;
  playerFlag: boolean = false;
  repeatFlag: boolean = false;
  shuffleFlag: boolean = false;
  shuffleQueue: number[] = [];
}

export default AppState;
