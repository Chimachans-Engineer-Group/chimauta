import CONSTANTS from "./constants.js";

class YouTubePlayerManager {
  constructor(domElements, state) {
    this.dom = domElements;
    this.state = state;
    this.player = null;
  }

  initPlayer() {
    this.player = new YT.Player("player", {
      playervars: {
        rel: 0,
      },
      events: {
        onReady: () => this.onPlayerReady(),
        onStateChange: (e) => this.onPlayerStateChange(e),
        onError: () => this.onPlayerError(),
      },
    });
  }

  onPlayerReady() {
    this.player.cueVideoById({
      videoId: this.state.songList[this.state.nowSongNum].videoId,
      startSeconds: this.state.songList[this.state.nowSongNum].startSeconds,
      endSeconds: this.state.songList[this.state.nowSongNum].endSeconds,
    });

    this.insertSongInfo();

    document.querySelector("body").classList.add("loaded");
    this.dom.searchText.disabled = false;
    this.dom.searchOptionSongTitle.disabled = false;
    this.dom.searchOptionArtist.disabled = false;
    this.dom.searchOptionVideoTitle.disabled = false;
    this.dom.searchOptionPostDate.disabled = false;
  }

  onPlayerStateChange(e) {
    // 再生終了のとき
    if (e.data == 0 && this.state.playerFlag == 1) {
      this.toPlayIcon();
      this.playSong();
      this.state.playerFlag = 0;
      this.stopCountingUpSeconds();
    }
    // 一時停止のとき
    else if (e.data == 2) {
      this.toPlayIcon();
      this.state.playerFlag = 0;
      this.stopCountingUpSeconds();
    }
    // バッファリング中のとき
    else if (e.data == 3) {
      this.toPauseIcon();
      if (this.state.nowSongNum != this.state.prevSongNum) {
        this.insertSongInfo();
      }
    }
    // 再生中のとき
    else if (e.data == 1) {
      this.toPauseIcon();
      this.state.playerFlag = 1;
      if (this.state.countUpSecondsFlag == 0) {
        this.startCountingUpSeconds();
      }
    }
  }

  onPlayerError() {
    this.insertSongInfo();
    this.state.playerFlag = 0;
    this.toPlayIcon();

    setTimeout(() => {
      if (this.state.playerFlag == 0) {
        this.playSong();
      }
    }, CONSTANTS.ERROR_RETRY_DELAY);
  }

  insertSeekBarValue(seconds) {
    if (typeof seconds === "number") {
      this.dom.menuTimeSeekBar.value = seconds;
    } else {
      seconds = this.dom.menuTimeSeekBar.value;
    }

    const percent = (seconds / this.state.wholeSeconds) * 100;
    this.dom.menuTimeSeekBar.style.backgroundImage = `linear-gradient(to right, var(--brand-color) ${percent}%, var(--gray1) ${percent}%)`;
  }

  formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return minutes + ":" + remainderSeconds;
  }

  insertSongInfo() {
    if (typeof this.state.prevSongNum === "number") {
      document.getElementById(`trackNum${this.state.prevSongNum}`).classList.remove("current");
    }
    document.getElementById(`trackNum${this.state.nowSongNum}`).classList.add("current");

    const currentSong = this.state.songList[this.state.nowSongNum];
    const currentVideo = this.state.videoList[currentSong.videoId];

    this.dom.playingBarThumb.src = `${CONSTANTS.THUMB_BASE_URL}${currentSong.videoId}/default.webp`;

    this.dom.playingBarSongTitle.textContent = currentSong.title;
    this.dom.playingBarSongTitle.title = currentSong.title;

    this.dom.playingBarArtist.textContent = currentSong.artist;
    this.dom.playingBarArtist.title = currentSong.artist;

    this.dom.playingBarVideoTitle.textContent = currentVideo.title;
    this.dom.playingBarVideoTitle.title = currentVideo.title;
    this.dom.playingBarPostDate.textContent = currentVideo.postDate.substring(0, 10);
    this.dom.playingBarPostDate.title = currentVideo.postDate;

    this.state.wholeSeconds = currentSong.duration;
    this.insertSeekBarValue(0);
    this.dom.menuTimeSeekBar.max = this.state.wholeSeconds;
    this.dom.menuTimeTextWhole.textContent = this.formatSeconds(this.state.wholeSeconds);
  }

  toPlayIcon() {
    this.dom.playingBarPause.classList.add("to-hide");
    this.dom.playingBarPlay.classList.remove("to-hide");
    this.dom.menuControllerPause.classList.add("to-hide");
    this.dom.menuControllerPlay.classList.remove("to-hide");

    this.dom.playingBarStatus.title = "再生";
    this.dom.menuControllerStatus.title = "再生";
  }

  toPauseIcon() {
    this.dom.playingBarPause.classList.remove("to-hide");
    this.dom.playingBarPlay.classList.add("to-hide");
    this.dom.menuControllerPause.classList.remove("to-hide");
    this.dom.menuControllerPlay.classList.add("to-hide");

    this.dom.playingBarStatus.title = "一時停止";
    this.dom.menuControllerStatus.title = "一時停止";
  }

  getSongCurrentTime() {
    const currentSeconds = Math.round(
      this.player.getCurrentTime() - this.state.songList[this.state.nowSongNum].startSeconds
    );
    this.insertSeekBarValue(currentSeconds);
    this.dom.menuTimeTextNow.textContent = this.formatSeconds(currentSeconds);
  }

  startCountingUpSeconds() {
    this.state.countUpSecondsFlag = 1;
    this.state.countUpSecondsInterval = setInterval(
      () => this.getSongCurrentTime(),
      CONSTANTS.UPDATE_INTERVAL
    );
  }

  stopCountingUpSeconds() {
    clearInterval(this.state.countUpSecondsInterval);
    this.state.countUpSecondsFlag = 0;
  }

  playSong(songNum) {
    this.state.prevSongNum = this.state.nowSongNum;

    // 曲を指定されたとき
    if (typeof songNum === "number") {
      this.state.nowSongNum = songNum;
    }
    // 連続で再生されたとき
    else if (this.state.repeatFlag == 0) {
      if (this.state.searchResult.length != 0) {
        if (this.state.shuffleFlag == 0) {
          const checkForExistence = this.state.searchResult.indexOf(this.state.nowSongNum);

          // 通常再生で最後の曲になったとき
          if (checkForExistence <= 0) {
            this.state.nowSongNum = this.state.searchResult[this.state.searchResult.length - 1];
          }
          // 通常再生のとき
          else {
            this.state.nowSongNum = this.state.searchResult[checkForExistence - 1];
          }
        }
        // シャッフル再生のとき
        else {
          this.state.nowSongNum =
            this.state.searchResult[Math.floor(Math.random() * this.state.searchResult.length)];
        }
      }
      // 検索条件でリストが空のとき
      else {
        window.alert("検索条件に一致する項目がないため、次の曲を再生できません。");
        return;
      }
    }
    // リピート再生のとき、nowSongNumは変化なし

    const currentSong = this.state.songList[this.state.nowSongNum];
    this.player.loadVideoById({
      videoId: currentSong.videoId,
      startSeconds: currentSong.startSeconds,
      endSeconds: currentSong.endSeconds,
    });
  }

  changePlayerStatus() {
    if (this.state.playerFlag == 1) {
      this.toPlayIcon();
      this.player.pauseVideo();
      this.state.playerFlag = 0;
    } else {
      this.toPauseIcon();
      this.player.playVideo();
      this.state.playerFlag = 1;
    }
  }

  seekTo() {
    this.state.playerFlag = 0;

    const currentSong = this.state.songList[this.state.nowSongNum];
    this.player.loadVideoById({
      videoId: currentSong.videoId,
      startSeconds: currentSong.startSeconds + Number(this.dom.menuTimeSeekBar.value),
      endSeconds: currentSong.endSeconds,
    });
  }
}

export default YouTubePlayerManager;
