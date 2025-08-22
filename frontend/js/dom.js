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

export default DOMElements;
