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

export default AppState;
