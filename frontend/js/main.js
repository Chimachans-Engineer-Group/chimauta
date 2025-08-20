// 定数定義
const CONSTANTS = {
  API_URL:
    "https://script.google.com/macros/s/AKfycbzANnxCbUliOy7eDUuGFBPRraKOKHvq_2-SsxGQMlZ10MaLEOAJZr6G9uawYieRK2ei/exec",
  YOUTUBE_API_URL: "https://www.youtube.com/iframe_api",
  UPDATE_INTERVAL: 250,
  ERROR_RETRY_DELAY: 5000,
  THUMB_BASE_URL: "https://img.youtube.com/vi_webp/",
  YOUTUBE_WATCH_URL: "https://youtu.be/",
  TWITTER_INTENT_URL:
    "https://x.com/intent/tweet?ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E",
};

// DOM要素管理クラス
class DOMElements {
  constructor() {
    this.init();
  }

  init() {
    // 検索関連
    this.searchForm = document.getElementById("searchForm");
    this.searchText = document.getElementById("searchText");
    this.searchOptionSongTitle = document.getElementById("searchOptionSongTitle");
    this.searchOptionArtist = document.getElementById("searchOptionArtist");
    this.searchOptionVideoTitle = document.getElementById("searchOptionVideoTitle");
    this.searchOptionPostDate = document.getElementById("searchOptionPostDate");
    this.searchOptionShare = document.getElementById("searchOptionShare");
    this.toClearSearchValue = document.getElementById("toClearSearchValue");
    this.entireNum = document.getElementById("entireNum");
    this.searchResultNum = document.getElementById("searchResultNum");

    // プレイヤー関連
    this.playingBarThumb = document.getElementById("playingBarThumb");
    this.playingBarThumbButton = document.getElementById("playingBarThumbButton");
    this.playingBarSongTitle = document.getElementById("playingBarSongTitle");
    this.playingBarArtist = document.getElementById("playingBarArtist");
    this.playingBarVideoTitle = document.getElementById("playingBarVideoTitle");
    this.playingBarPostDate = document.getElementById("playingBarPostDate");
    this.playingBarStatus = document.getElementById("playingBarStatus");
    this.playingBarPlay = document.getElementById("playingBarPlay");
    this.playingBarPause = document.getElementById("playingBarPause");

    // メニュー関連
    this.menuButton = document.getElementById("menuButton");
    this.menuControllerRepeat = document.getElementById("menuControllerRepeat");
    this.menuControllerPrev = document.getElementById("menuControllerPrev");
    this.menuControllerStatus = document.getElementById("menuControllerStatus");
    this.menuControllerPlay = document.getElementById("menuControllerPlay");
    this.menuControllerPause = document.getElementById("menuControllerPause");
    this.menuControllerNext = document.getElementById("menuControllerNext");
    this.menuControllerShuffle = document.getElementById("menuControllerShuffle");
    this.menuTimeSeekBar = document.getElementById("menuTimeSeekBar");
    this.menuTimeTextNow = document.getElementById("menuTimeTextNow");
    this.menuTimeTextWhole = document.getElementById("menuTimeTextWhole");

    // その他
    this.tracks = document.getElementById("tracks");
    this.toPageTop = document.getElementById("toPageTop");
  }
}

// アプリケーションの状態管理
class AppState {
  constructor() {
    this.songList = null;
    this.videoList = null;
    this.searchResult = [];
    this.nowSongNum = null;
    this.prevSongNum = null;
    this.wholeSeconds = 0;
    this.countUpSecondsInterval = null;
    this.countUpSecondsFlag = false;
    this.playerFlag = false;
    this.repeatFlag = false;
    this.shuffleFlag = false;
  }
}

// YouTubeプレイヤー管理クラス
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

// 検索機能管理クラス
class SearchManager {
  constructor(domElements, state) {
    this.dom = domElements;
    this.state = state;
  }

  initSearch() {
    this.dom.searchForm.addEventListener("input", () => this.performSearch());

    const checkboxes = document.querySelectorAll('#searchOption input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => this.performSearch());
    });

    this.dom.searchText.addEventListener("keypress", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
      }
    });

    this.dom.toClearSearchValue.addEventListener("click", () => {
      this.dom.searchText.value = "";
      this.dom.searchText.focus();
      this.performSearch();
    });
  }

  performSearch() {
    const searchWord = this.dom.searchText.value;
    const songTitleChecked = this.dom.searchOptionSongTitle.checked;
    const artistChecked = this.dom.searchOptionArtist.checked;
    const videoTitleChecked = this.dom.searchOptionVideoTitle.checked;
    const postDateChecked = this.dom.searchOptionPostDate.checked;

    this.updatePageTitle(searchWord);
    this.updateURLAndShare(
      searchWord,
      songTitleChecked,
      artistChecked,
      videoTitleChecked,
      postDateChecked
    );
    this.updateClearButton(searchWord);

    const searchWordRegex = new RegExp(searchWord, "i");

    this.state.searchResult = this.state.songList.flatMap((track, i) => {
      const testOfSongTitle = songTitleChecked && searchWordRegex.test(track.title);
      const testOfArtist = artistChecked && searchWordRegex.test(track.artist);
      const testOfVideoTitle =
        videoTitleChecked && searchWordRegex.test(this.state.videoList[track.videoId].title);
      const testOfPostDate =
        postDateChecked && searchWordRegex.test(this.state.videoList[track.videoId].postDate);

      const beingProcessedTrackRow = document.getElementById(`trackNum${i}`);

      if (testOfSongTitle || testOfArtist || testOfVideoTitle || testOfPostDate) {
        beingProcessedTrackRow.classList.remove("to-hide");
        return i;
      } else {
        beingProcessedTrackRow.classList.add("to-hide");
        return [];
      }
    });

    this.dom.searchResultNum.textContent = this.state.searchResult.length;
  }

  updatePageTitle(searchWord) {
    const currentTitle = `${
      searchWord !== "" ? `${searchWord} - ` : ""
    }ちまうた｜町田ちま非公式ファンサイト`;
    document.title = currentTitle;
  }

  updateURLAndShare(
    searchWord,
    songTitleChecked,
    artistChecked,
    videoTitleChecked,
    postDateChecked
  ) {
    const shareURL = location.origin;
    const currentShareURL = new URL(shareURL);
    currentShareURL.search = new URLSearchParams({
      q: searchWord,
      type: [songTitleChecked, artistChecked, videoTitleChecked, postDateChecked]
        .map((v) => Number(v))
        .join(""),
    });
    history.replaceState("", document.title, currentShareURL.toString());

    const baseURL = CONSTANTS.TWITTER_INTENT_URL;
    const currentBaseURL = new URL(baseURL);
    currentBaseURL.search = new URLSearchParams({
      url: currentShareURL.toString(),
      text: document.title,
    });
    this.dom.searchOptionShare.href = currentBaseURL.toString();
  }

  updateClearButton(searchWord) {
    if (searchWord == "") {
      this.dom.toClearSearchValue.classList.add("invisible");
    } else {
      this.dom.toClearSearchValue.classList.remove("invisible");
    }
  }

  handleURLParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const queryKeyName = "q";
    if (searchParams.has(queryKeyName)) {
      const typeKeyName = "type";
      const query = searchParams.get(queryKeyName);
      const type = searchParams.get(typeKeyName);
      this.dom.searchText.value = query;
      if (type) {
        this.dom.searchOptionSongTitle.checked = Number(type.charAt(0));
        this.dom.searchOptionArtist.checked = Number(type.charAt(1));
        this.dom.searchOptionVideoTitle.checked = Number(type.charAt(2));
        this.dom.searchOptionPostDate.checked = Number(type.charAt(3));
      }
      this.performSearch();
      this.state.nowSongNum = this.state.searchResult[this.state.searchResult.length - 1];
    }
  }
}

// UI管理クラス
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

// データ管理クラス
class DataManager {
  constructor() {
    this.apiUrl = CONSTANTS.API_URL;
  }

  async fetchData() {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Data fetch error:", error);
      throw error;
    }
  }

  processData(data) {
    const songList = data.song.map((song, i) => ({
      title: song[0],
      artist: song[1],
      videoId: song[2],
      startSeconds: song[3],
      endSeconds: song[4],
      duration: song[4] - song[3],
    }));

    const videoList = {};
    data.video.forEach((video) => {
      videoList[video[0]] = {
        title: video[1],
        postDate: video[2],
      };
    });

    return { songList, videoList };
  }
}

// メインアプリケーションクラス
class ChimautaApp {
  constructor() {
    this.dom = new DOMElements();
    this.state = new AppState();
    this.dataManager = new DataManager();
    this.playerManager = new YouTubePlayerManager(this.dom, this.state);
    this.searchManager = new SearchManager(this.dom, this.state);
    this.uiManager = new UIManager(this.dom, this.state, this.playerManager);
  }

  async init() {
    try {
      await this.loadYouTubeAPI();
      await this.loadData();
      this.initializeUI();
      this.handleInitialState();
    } catch (error) {
      console.error("Application initialization error:", error);
    }
  }

  async loadYouTubeAPI() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      window.onYouTubeIframeAPIReady = resolve;

      const script = document.createElement("script");
      script.src = CONSTANTS.YOUTUBE_API_URL;
      document.head.appendChild(script);
    });
  }

  async loadData() {
    const data = await this.dataManager.fetchData();
    const { songList, videoList } = this.dataManager.processData(data);

    this.state.songList = songList;
    this.state.videoList = videoList;
    this.state.searchResult = songList.map((_, i) => i);
    this.state.nowSongNum = this.state.searchResult[this.state.searchResult.length - 1];

    this.dom.entireNum.textContent = songList.length;
    this.dom.searchResultNum.textContent = songList.length;
  }

  initializeUI() {
    this.uiManager.createTrackList();
    this.uiManager.initUI();
    this.searchManager.initSearch();
    this.playerManager.initPlayer();
  }

  handleInitialState() {
    this.searchManager.handleURLParams();
    this.uiManager.createMenuShare();
  }
}

// アプリケーション開始
document.addEventListener("DOMContentLoaded", () => {
  const app = new ChimautaApp();
  app.init();
});
