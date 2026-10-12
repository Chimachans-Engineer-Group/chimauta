export interface Track {
  title: string;
  artist: string;
  videoId: string;
  startSeconds: number;
  endSeconds?: number;
  duration: number;
}

export interface Video {
  title: string;
  postDate: string;
}

export type VideoList = Record<string, Video>;

export interface ApiResponse {
  tracks: Track[];
  videos: VideoList;
}

export interface YTPlayer {
  cueVideoById(options: { videoId: string; startSeconds?: number; endSeconds?: number }): void;
  loadVideoById(options: { videoId: string; startSeconds?: number; endSeconds?: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
}

export interface YTPlayerEvent {
  data: number;
  target: YTPlayer;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: YTPlayerEvent) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
