import CONSTANTS from "./constants.js";
import DataManager from "./data.js";
import DOMElements from "./dom.js";
import YouTubePlayerManager from "./player.js";
import SearchManager from "./search.js";
import AppState from "./state.js";
import UIManager from "./ui.js";

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
    this.state.searchResult = this.state.songList.map((_, i) => i);
    this.state.nowSongNum = this.state.searchResult[this.state.searchResult.length - 1];

    this.dom.entireNum.textContent = this.state.songList.length;
    this.dom.searchResultNum.textContent = this.state.searchResult.length;
  }

  initializeUI() {
    this.uiManager.createTrackList();
    this.uiManager.initUI();
    this.searchManager.initSearch();
    this.playerManager.initPlayer();
  }

  handleInitialState() {
    this.searchManager.handleURLParams();
  }
}

export default ChimautaApp;
