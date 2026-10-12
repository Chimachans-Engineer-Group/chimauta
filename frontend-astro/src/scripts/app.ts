import DataManager from "./data";
import DOMElements from "./dom";
import YouTubePlayerManager from "./player";
import SearchManager from "./search";
import AppState from "./state";
import UIManager from "./ui";

class ChimautaApp {
  dom: DOMElements;
  state: AppState;
  dataManager: DataManager;
  playerManager: YouTubePlayerManager;
  searchManager: SearchManager;
  uiManager: UIManager;

  constructor() {
    this.dom = new DOMElements();
    this.state = new AppState();
    this.dataManager = new DataManager();
    this.playerManager = new YouTubePlayerManager(this.dom, this.state);
    this.searchManager = new SearchManager(this.dom, this.state);
    this.uiManager = new UIManager(this.dom, this.state, this.playerManager);
  }

  async init(): Promise<void> {
    try {
      await this.loadYouTubeAPI();
      await this.loadData();
      this.initializeUI();
      this.handleInitialState();
    } catch (error) {
      console.error("Application initialization error:", error);
    }
  }

  async loadYouTubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const existingHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof existingHandler === "function") existingHandler();
        resolve();
      };
      setTimeout(() => {
        if (window.YT && window.YT.Player) {
          resolve();
        } else {
          console.warn("YouTube IFrame API load timed out, proceeding anyway.");
          resolve();
        }
      }, 10000);
    });
  }

  async loadData(): Promise<void> {
    const data = await this.dataManager.fetchData();
    const { songList, videoList } = this.dataManager.processData(data);

    this.state.songList = songList || [];
    this.state.videoList = videoList || {};
    this.state.searchResult = this.state.songList.map((_, i) => i);
    this.state.nowSongNum =
      this.state.searchResult.length > 0
        ? this.state.searchResult[this.state.searchResult.length - 1]
        : null;

    this.dom.entireNum.textContent = String(this.state.songList.length);
    this.dom.searchResultNum.textContent = String(this.state.searchResult.length);
  }

  initializeUI(): void {
    this.uiManager.createTrackList();
    this.uiManager.initUI();
    this.searchManager.initSearch();
    this.playerManager.initPlayer();
  }

  handleInitialState(): void {
    this.searchManager.handleURLParams();
  }
}

const app = new ChimautaApp();
app.init();
