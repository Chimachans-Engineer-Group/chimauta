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
    this.dom.menuControllerPrev.addEventListener("click", () => this.playerManager.playSong());
    this.dom.menuControllerNext.addEventListener("click", () => this.playerManager.playSong());
  }

  initScrollButton() {
    this.dom.toPageTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        this.dom.toPageTop.classList.remove("invisible");
      } else {
        this.dom.toPageTop.classList.add("invisible");
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
      this.playerManager.insertSeekBarValue();
    });

    this.dom.menuTimeSeekBar.addEventListener("change", () => {
      this.playerManager.seekTo();
    });
  }

  changeMenuStatus() {
    this.isMenuOpened = !this.isMenuOpened;

    if (this.isMenuOpened) {
      document.querySelector("body").classList.add("menu-open");
      this.dom.menuButton.ariaExpanded = "true";
    } else {
      document.querySelector("body").classList.remove("menu-open");
      this.dom.menuButton.ariaExpanded = "false";
    }
  }

  changeRepeat() {
    if (this.state.repeatFlag) {
      this.dom.menuControllerRepeat.classList.remove("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを無効にする";
      this.state.repeatFlag = false;
    } else {
      this.dom.menuControllerRepeat.classList.add("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを有効にする";
      this.state.repeatFlag = true;
    }
  }

  changeShuffle() {
    if (this.state.shuffleFlag) {
      this.dom.menuControllerShuffle.classList.remove("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを無効にする";
      this.state.shuffleFlag = false;
    } else {
      this.dom.menuControllerShuffle.classList.add("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを有効にする";
      this.state.shuffleFlag = true;
    }
  }

  createTrackList() {
    const trackTemplate = document.querySelector("#trackTemplate");

    [...this.state.songList].reverse().forEach((track, i) => {
      const clonedElement = trackTemplate.content.cloneNode(true);
      const li = clonedElement.querySelector("li");
      li.id = `trackNum${i}`;

      const trackButton = clonedElement.querySelector(".track-button");
      trackButton.addEventListener("click", () => this.playerManager.playSong(i));

      const thumb = clonedElement.querySelector(".track-button-video-thumb");
      thumb.src = `${CONSTANTS.THUMB_BASE_URL}${track.videoId}/default.webp`;
      thumb.alt = this.state.videoList[track.videoId].title;

      const songTitle = clonedElement.querySelector(".track-button-info-title");
      songTitle.textContent = track.title;

      const artist = clonedElement.querySelector(".track-button-info-artist");
      artist.textContent = track.artist;

      const duration = clonedElement.querySelector(".track-duration");
      duration.textContent = this.playerManager.formatSeconds(track.duration);

      const ytLink = clonedElement.querySelector(".track-videoinfo-ytlink");
      ytLink.href = `${CONSTANTS.YOUTUBE_WATCH_URL}${track.videoId}&t=${track.startSeconds}s`;
      ytLink.textContent = this.state.videoList[track.videoId].title;

      const postDate = clonedElement.querySelector(".track-videoinfo-postdate");
      postDate.textContent = this.state.videoList[track.videoId].postDate.substring(0, 10);

      this.dom.tracks.appendChild(clonedElement);
    });
  }
}

export default UIManager;
