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
    this.state.repeatFlag = this.state.repeatFlag ? 0 : 1;

    if (this.state.repeatFlag) {
      this.dom.menuControllerRepeat.classList.remove("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを無効にする";
    } else {
      this.dom.menuControllerRepeat.classList.add("disabled");
      this.dom.menuControllerRepeat.title = "1曲リピートを有効にする";
    }
  }

  changeShuffle() {
    this.state.shuffleFlag = this.state.shuffleFlag ? 0 : 1;

    if (this.state.shuffleFlag) {
      this.dom.menuControllerShuffle.classList.remove("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを無効にする";
    } else {
      this.dom.menuControllerShuffle.classList.add("disabled");
      this.dom.menuControllerShuffle.title = "シャッフルを有効にする";
    }
  }

  createTrackList() {
    const trackTemplate = document.querySelector("#trackTemplate");

    this.state.songList.forEach((track, i) => {
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

  createMenuShare() {
    const shareMenuList = document.querySelector(".menu-share");
    const currentSong = this.state.songList[this.state.nowSongNum];
    const currentVideo = this.state.videoList[currentSong.videoId];

    const shareData = [
      {
        text: "X (Twitter) でポスト",
        href: `https://x.com/intent/tweet?ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&url=${
          CONSTANTS.YOUTUBE_WATCH_URL
        }${currentSong.videoId}&t=${currentSong.startSeconds}s&hashtags=ちまうた&text=${escapeHTML(
          currentSong.title
        )} - ${escapeHTML(currentSong.artist)}`,
        icon: "fa-brands fa-x-twitter",
      },
      {
        text: "YouTube で開く",
        href: `${CONSTANTS.YOUTUBE_WATCH_URL}${currentSong.videoId}&t=${currentSong.startSeconds}s`,
        icon: "fa-brands fa-youtube",
      },
    ];

    shareMenuList.innerHTML = "";
    shareData.forEach(({ text, href, icon }) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = text;
      link.className = "menu-share-btn";

      const iconElement = document.createElement("i");
      iconElement.className = icon;
      link.prepend(iconElement);

      li.appendChild(link);
      shareMenuList.appendChild(li);
    });
  }
}

export default UIManager;
