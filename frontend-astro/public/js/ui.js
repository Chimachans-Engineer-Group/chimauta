import CONSTANTS from "./constants.js";

class UIManager {
  constructor(domElements, state, playerManager) {
    this.dom = domElements;
    this.state = state;
    this.playerManager = playerManager;
    this.isMenuOpened = false;
  }

  initUI() {
    this.initMenuButtons();
    this.initControlButtons();
    this.initScrollButton();
    this.initPlayingBarThumb();
    this.initSeekBar();
    this.initTrackListEvents();
    this.initWhenBeforeunload();
  }

  initMenuButtons() {
    this.dom.menuButton.addEventListener("click", () => this.changeMenuStatus());
    this.dom.menuControllerRepeat.addEventListener("click", () => this.changeRepeat());
    this.dom.menuControllerShuffle.addEventListener("click", () => this.changeShuffle());
  }

  initControlButtons() {
    this.dom.playingBarStatus.addEventListener("click", () =>
      this.playerManager.changePlayerStatus()
    );
    this.dom.menuControllerStatus.addEventListener("click", () =>
      this.playerManager.changePlayerStatus()
    );
    this.dom.menuControllerPrev.addEventListener("click", () => {
      this.playerManager.playSong(this.state.nowSongNum);
    });
    this.dom.menuControllerNext.addEventListener("click", () => this.playerManager.playSong());
  }

  initTrackListEvents() {
    this.dom.tracks.addEventListener("click", (e) => {
      const trackButton = e.target.closest(".track-button");
      if (trackButton && trackButton.dataset.index !== undefined) {
        this.playerManager.playSong(Number(trackButton.dataset.index));
      }
    });
  }

  initScrollButton() {
    this.dom.toPageTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let isTicking = false;
    window.addEventListener("scroll", () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 100) {
            this.dom.toPageTop.classList.remove("invisible");
          } else {
            this.dom.toPageTop.classList.add("invisible");
          }
          isTicking = false;
        });
        isTicking = true;
      }
    });
  }

  initPlayingBarThumb() {
    this.dom.playingBarThumbButton.addEventListener("click", () => {
      const targetElement = document.getElementById(`trackNum${this.state.nowSongNum}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  initSeekBar() {
    this.dom.menuTimeSeekBar.addEventListener("input", () => {
      this.playerManager.stopCountingUpSeconds();
      this.playerManager.insertSeekBarValue();
      this.dom.menuTimeTextNow.textContent = this.playerManager.formatSeconds(this.dom.menuTimeSeekBar.value);
    });

    this.dom.menuTimeSeekBar.addEventListener("change", () => {
      this.playerManager.seekTo();
    });
  }

  initWhenBeforeunload() {
    // ページを離れたとき
    window.addEventListener("beforeunload", (e) => {
      // 再生中だったら
      if (this.state.playerFlag) {
        // 離脱防止アラートを出す
        e.preventDefault();
      }
    });
  }

  changeMenuStatus() {
    this.isMenuOpened = !this.isMenuOpened;

    if (this.isMenuOpened) {
      document.querySelector("body").classList.add("open-nav");
      this.dom.menuButton.ariaExpanded = "true";
    } else {
      document.querySelector("body").classList.remove("open-nav");
      this.dom.menuButton.ariaExpanded = "false";
    }
  }

  changeRepeat() {
    if (this.state.repeatFlag) {
      this.dom.menuControllerRepeat.classList.add("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを有効にする";
    } else {
      this.dom.menuControllerRepeat.classList.remove("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを無効にする";
    }
    this.state.repeatFlag = !this.state.repeatFlag;
  }

  changeShuffle() {
    if (this.state.shuffleFlag) {
      this.dom.menuControllerShuffle.classList.add("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを有効にする";
      this.state.shuffleQueue = [];
    } else {
      this.dom.menuControllerShuffle.classList.remove("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを無効にする";
      this.playerManager.generateShuffleQueue();
    }
    this.state.shuffleFlag = !this.state.shuffleFlag;
  }

  createTrackList() {
    const trackTemplate = document.querySelector("#trackTemplate");
    const fragment = document.createDocumentFragment();

    for (let i = this.state.songList.length - 1; i >= 0; i--) {
      const track = this.state.songList[i];
      const clonedElement = trackTemplate.content.cloneNode(true);
      const li = clonedElement.querySelector("li");
      li.id = `trackNum${i}`;

      const trackButton = clonedElement.querySelector(".track-button");
      trackButton.dataset.index = i;

      const thumb = clonedElement.querySelector(".track-button-video-thumb");
      thumb.src = `${CONSTANTS.THUMB_BASE_URL}${track.videoId}/default.webp`;
      thumb.loading = "lazy";
      thumb.decoding = "async";

      const songTitle = clonedElement.querySelector(".track-button-info-title");
      songTitle.textContent = track.title;
      songTitle.title = track.title;

      const artist = clonedElement.querySelector(".track-button-info-artist");
      artist.textContent = track.artist;
      artist.title = track.artist;

      const ytLink = clonedElement.querySelector(".track-videoinfo-ytlink");
      ytLink.href = `${CONSTANTS.YOUTUBE_WATCH_URL}${track.videoId}?t=${track.startSeconds}s`;
      ytLink.title = this.state.videoList[track.videoId].title;

      const postDate = clonedElement.querySelector(".track-videoinfo-postdate");
      postDate.textContent = this.state.videoList[track.videoId].postDate;

      const duration = clonedElement.querySelector(".track-duration");
      duration.textContent = this.playerManager.formatSeconds(track.duration);

      fragment.appendChild(clonedElement);
    }

    this.dom.tracks.appendChild(fragment);
  }
}

export default UIManager;
