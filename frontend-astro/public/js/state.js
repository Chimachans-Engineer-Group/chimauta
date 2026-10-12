class AppState {
  constructor() {
    /** @type {Array<object>|null} */
    this.songList = null;
    /** @type {object|null} */
    this.videoList = null;
    /** @type {number[]} */
    this.searchResult = [];
    /** @type {number|null} */
    this.nowSongNum = null;
    /** @type {number|null} */
    this.prevSongNum = null;
    /** @type {number} */
    this.wholeSeconds = 0;
    /** @type {number|null} */
    this.countUpSecondsInterval = null;
    /** @type {boolean} */
    this.countUpSecondsFlag = false;
    /** @type {boolean} */
    this.playerFlag = false;
    /** @type {boolean} */
    this.repeatFlag = false;
    /** @type {boolean} */
    this.shuffleFlag = false;
    /** @type {number[]} */
    this.shuffleQueue = [];
  }
}

export default AppState;
