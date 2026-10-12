import { useEffect, useState, useRef } from "preact/hooks";
import { useStore } from "@nanostores/preact";
import {
  $isPlaying,
  $currentTime,
  $duration,
  $isRepeat,
  $isShuffle,
  $isMenuOpen,
  $currentSong,
  $currentVideo,
  $nowSongNum,
  togglePlay,
  toggleRepeat,
  toggleShuffle,
  toggleMenu,
  playSong,
  seekTo,
} from "../../stores/playerStore";
import CONSTANTS from "../../scripts/constants";
import {
  ChevronUpIcon,
  PlayFillIcon,
  PauseFillIcon,
  PlayCircleFillIcon,
  PauseCircleFillIcon,
  SkipStartFillIcon,
  SkipEndFillIcon,
  ArrowRepeatIcon,
  ShuffleIcon,
} from "./icons";
import "../PlayingBar.css";

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export function PlayingBar() {
  const isPlaying = useStore($isPlaying);
  const currentTime = useStore($currentTime);
  const duration = useStore($duration);
  const isRepeat = useStore($isRepeat);
  const isShuffle = useStore($isShuffle);
  const isMenuOpen = useStore($isMenuOpen);
  const currentSong = useStore($currentSong);
  const currentVideo = useStore($currentVideo);
  const nowSongNum = useStore($nowSongNum);

  const [showToTop, setShowToTop] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  // スクロール検知で「一番上に戻る」ボタンの表示制御
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowToTop(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToCurrentTrack = () => {
    if (typeof nowSongNum === "number") {
      const el = document.getElementById(`trackNum${nowSongNum}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const displayTime = isSeeking ? seekValue : currentTime;
  const percent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const seekBarStyle = {
    backgroundImage: `linear-gradient(to right, var(--brand-color) ${percent}%, var(--gray1) ${percent}%)`,
  };

  return (
    <div class="playing-bar">
      <button
        type="button"
        title="一番上に戻る"
        aria-label="一番上に戻る"
        class={`to-page-top ${showToTop ? "" : "invisible"}`}
        id="toPageTop"
        onClick={handleScrollToTop}
      >
        <ChevronUpIcon />
      </button>

      <div class="playing-bar-information">
        <button
          type="button"
          title="該当する行までスクロール"
          aria-label="該当する行までスクロール"
          class="playing-bar-thumb-button"
          id="playingBarThumbButton"
          onClick={handleScrollToCurrentTrack}
        >
          {currentSong && (
            <img
              class="playing-bar-thumb-button-img"
              id="playingBarThumb"
              alt={currentSong ? `${currentSong.title} のサムネイル` : ""}
              src={`${CONSTANTS.THUMB_BASE_URL}${currentSong.videoId}/default.webp`}
            />
          )}
          {!currentSong && (
            <img class="playing-bar-thumb-button-img" id="playingBarThumb" alt="" />
          )}
        </button>

        <div class="playing-bar-text">
          <div class="playing-bar-text-top">
            <span
              class="playing-bar-song-title"
              id="playingBarSongTitle"
              title={currentSong?.title ?? ""}
            >
              {currentSong?.title ?? ""}
            </span>
            <span
              class="playing-bar-artist"
              id="playingBarArtist"
              title={currentSong?.artist ?? ""}
            >
              {currentSong?.artist ?? ""}
            </span>
          </div>
          <div class="playing-bar-text-bottom">
            <span
              class="playing-bar-post-date"
              id="playingBarPostDate"
              title={currentVideo?.postDate ?? ""}
            >
              {currentVideo?.postDate ? currentVideo.postDate.substring(0, 10) : ""}
            </span>
            <span
              class="playing-bar-video-title"
              id="playingBarVideoTitle"
              title={currentVideo?.title ?? ""}
            >
              {currentVideo?.title ?? ""}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        title={isPlaying ? "一時停止" : "再生"}
        aria-label={isPlaying ? "一時停止" : "再生"}
        class="playing-bar-button playing-bar-status"
        id="playingBarStatus"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <PauseFillIcon id="playingBarPause" />
        ) : (
          <PlayFillIcon id="playingBarPlay" />
        )}
      </button>

      <button
        type="button"
        title={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        class="playing-bar-button menu-btn"
        id="menuButton"
        aria-controls="menuContent"
        aria-expanded={isMenuOpen ? "true" : "false"}
        onClick={toggleMenu}
      >
        <span class="menu-btn-icon" aria-hidden="true">
          <span class="menu-btn-line"></span>
          <span class="menu-btn-line"></span>
          <span class="menu-btn-line"></span>
        </span>

        <span class="menu-btn-open">MENU</span>
        <span class="menu-btn-close">CLOSE</span>
      </button>

      <div class="menu-content" id="menuContent">
        <div class="menu-controller">
          <button
            type="button"
            title={isRepeat ? "1曲リピートを無効にする" : "1曲リピートを有効にする"}
            aria-label={isRepeat ? "1曲リピートを無効にする" : "1曲リピートを有効にする"}
            class={`menu-controller-button ${isRepeat ? "" : "disabled"}`}
            id="menuControllerRepeat"
            onClick={toggleRepeat}
          >
            <ArrowRepeatIcon />
            <div class="menu-controller-repeat-text">1</div>
          </button>

          <button
            type="button"
            title="はじめから"
            aria-label="はじめから"
            class="menu-controller-button"
            id="menuControllerPrev"
            onClick={() => {
              if (typeof nowSongNum === "number") {
                playSong(nowSongNum);
              }
            }}
          >
            <SkipStartFillIcon />
          </button>

          <button
            type="button"
            title={isPlaying ? "一時停止" : "再生"}
            aria-label={isPlaying ? "一時停止" : "再生"}
            class="menu-controller-button menu-controller-status"
            id="menuControllerStatus"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <PauseCircleFillIcon id="menuControllerPause" />
            ) : (
              <PlayCircleFillIcon id="menuControllerPlay" />
            )}
          </button>

          <button
            type="button"
            title="次の曲へ"
            aria-label="次の曲へ"
            class="menu-controller-button"
            id="menuControllerNext"
            onClick={() => playSong()}
          >
            <SkipEndFillIcon />
          </button>

          <button
            type="button"
            title={isShuffle ? "シャッフルを無効にする" : "シャッフルを有効にする"}
            aria-label={isShuffle ? "シャッフルを無効にする" : "シャッフルを有効にする"}
            class={`menu-controller-button ${isShuffle ? "" : "disabled"}`}
            id="menuControllerShuffle"
            onClick={toggleShuffle}
          >
            <ShuffleIcon />
          </button>
        </div>

        <div class="menu-time">
          <input
            type="range"
            class="menu-time-seek-bar"
            id="menuTimeSeekBar"
            min="0"
            max={String(duration)}
            value={displayTime}
            style={seekBarStyle}
            aria-label="再生位置シークバー"
            onInput={(e) => {
              setIsSeeking(true);
              setSeekValue(Number(e.currentTarget.value));
            }}
            onChange={(e) => {
              const val = Number(e.currentTarget.value);
              setIsSeeking(false);
              seekTo(val);
            }}
          />

          <div class="menu-time-text">
            <span class="menu-time-text-now" id="menuTimeTextNow">
              {formatSeconds(displayTime)}
            </span>
            <span class="menu-time-text-whole" id="menuTimeTextWhole">
              {formatSeconds(duration)}
            </span>
          </div>
        </div>

        <div class="menu-share" aria-hidden="true"></div>
      </div>
    </div>
  );
}

export default PlayingBar;
