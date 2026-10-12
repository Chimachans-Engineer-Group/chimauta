import CONSTANTS from "./constants";
import type DOMElements from "./dom";
import type YouTubePlayerManager from "./player";
import type AppState from "./state";

class UIManager {
  dom: DOMElements;
  state: AppState;
  playerManager: YouTubePlayerManager;
  isMenuOpened: boolean = false;

  constructor(
    domElements: DOMElements,
    state: AppState,
    playerManager: YouTubePlayerManager
  ) {
    this.dom = domElements;
    this.state = state;
    this.playerManager = playerManager;
  }

  initUI(): void {
    this.initMenuButtons();
    this.initControlButtons();
    this.initScrollButton();
    this.initPlayingBarThumb();
    this.initSeekBar();
    this.initTrackListEvents();
    this.initWhenBeforeunload();
  }

  initMenuButtons(): void {
    this.dom.menuButton.addEventListener("click", () => this.changeMenuStatus());
    this.dom.menuControllerRepeat.addEventListener("click", () => this.changeRepeat());
    this.dom.menuControllerShuffle.addEventListener("click", () => this.changeShuffle());
  }

  initControlButtons(): void {
    this.dom.playingBarStatus.addEventListener("click", () =>
      this.playerManager.changePlayerStatus()
    );
    this.dom.menuControllerStatus.addEventListener("click", () =>
      this.playerManager.changePlayerStatus()
    );
    this.dom.menuControllerPrev.addEventListener("click", () => {
      if (typeof this.state.nowSongNum === "number") {
        this.playerManager.playSong(this.state.nowSongNum);
      }
    });
    this.dom.menuControllerNext.addEventListener("click", () => this.playerManager.playSong());
  }

  initTrackListEvents(): void {
    this.dom.tracks.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const trackButton = target?.closest<HTMLElement>(".track-button");
      if (trackButton && trackButton.dataset.index !== undefined) {
        this.playerManager.playSong(Number(trackButton.dataset.index));
      }
    });
  }

  initScrollButton(): void {
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

  initPlayingBarThumb(): void {
    this.dom.playingBarThumbButton.addEventListener("click", () => {
      if (typeof this.state.nowSongNum === "number") {
        const targetElement = document.getElementById(`trackNum${this.state.nowSongNum}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  initSeekBar(): void {
    this.dom.menuTimeSeekBar.addEventListener("input", () => {
      this.playerManager.stopCountingUpSeconds();
      this.playerManager.insertSeekBarValue();
      this.dom.menuTimeTextNow.textContent = this.playerManager.formatSeconds(
        Number(this.dom.menuTimeSeekBar.value)
      );
    });

    this.dom.menuTimeSeekBar.addEventListener("change", () => {
      this.playerManager.seekTo();
    });
  }

  initWhenBeforeunload(): void {
    // ページを離れたとき
    window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
      // 再生中だったら
      if (this.state.playerFlag) {
        // 離脱防止アラートを出す
        e.preventDefault();
      }
    });
  }

  changeMenuStatus(): void {
    this.isMenuOpened = !this.isMenuOpened;

    const body = document.querySelector("body");
    if (this.isMenuOpened) {
      body?.classList.add("open-nav");
      this.dom.menuButton.setAttribute("aria-expanded", "true");
    } else {
      body?.classList.remove("open-nav");
      this.dom.menuButton.setAttribute("aria-expanded", "false");
    }
  }

  changeRepeat(): void {
    if (this.state.repeatFlag) {
      this.dom.menuControllerRepeat.classList.add("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを有効にする";
    } else {
      this.dom.menuControllerRepeat.classList.remove("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを無効にする";
    }
    this.state.repeatFlag = !this.state.repeatFlag;
  }

  changeShuffle(): void {
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

  createTrackList(): void {
    const trackTemplate = document.querySelector<HTMLTemplateElement>("#trackTemplate");
    if (!trackTemplate) {
      return;
    }
    const fragment = document.createDocumentFragment();

    for (let i = this.state.songList.length - 1; i >= 0; i--) {
      const track = this.state.songList[i];
      const clonedElement = trackTemplate.content.cloneNode(true) as DocumentFragment;
      const li = clonedElement.querySelector<HTMLLIElement>("li");
      if (li) {
        li.id = `trackNum${i}`;
      }

      const trackButton = clonedElement.querySelector<HTMLElement>(".track-button");
      if (trackButton) {
        trackButton.dataset.index = String(i);
      }

      const thumb = clonedElement.querySelector<HTMLImageElement>(".track-button-video-thumb");
      if (thumb) {
        thumb.src = `${CONSTANTS.THUMB_BASE_URL}${track.videoId}/default.webp`;
        thumb.loading = "lazy";
        thumb.decoding = "async";
      }

      const songTitle = clonedElement.querySelector<HTMLElement>(".track-button-info-title");
      if (songTitle) {
        songTitle.textContent = track.title;
        songTitle.title = track.title;
      }

      const artist = clonedElement.querySelector<HTMLElement>(".track-button-info-artist");
      if (artist) {
        artist.textContent = track.artist;
        artist.title = track.artist;
      }

      const video = this.state.videoList[track.videoId];
      const ytLink = clonedElement.querySelector<HTMLAnchorElement>(".track-videoinfo-ytlink");
      if (ytLink) {
        ytLink.href = `${CONSTANTS.YOUTUBE_WATCH_URL}${track.videoId}?t=${track.startSeconds}s`;
        if (video) {
          ytLink.title = video.title;
        }
      }

      const postDate = clonedElement.querySelector<HTMLElement>(".track-videoinfo-postdate");
      if (postDate && video) {
        postDate.textContent = video.postDate;
      }

      const duration = clonedElement.querySelector<HTMLElement>(".track-duration");
      if (duration) {
        duration.textContent = this.playerManager.formatSeconds(track.duration);
      }

      fragment.appendChild(clonedElement);
    }

    this.dom.tracks.appendChild(fragment);
  }
}

export default UIManager;
