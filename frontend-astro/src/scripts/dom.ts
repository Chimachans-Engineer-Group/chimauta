class DOMElements {
  searchForm!: HTMLFormElement;
  searchText!: HTMLInputElement;
  searchOptionSongTitle!: HTMLInputElement;
  searchOptionArtist!: HTMLInputElement;
  searchOptionVideoTitle!: HTMLInputElement;
  searchOptionPostDate!: HTMLInputElement;
  searchOptionShare!: HTMLAnchorElement;
  toClearSearchValue!: HTMLButtonElement;
  entireNum!: HTMLElement;
  searchResultNum!: HTMLElement;

  playingBarThumb!: HTMLImageElement;
  playingBarThumbButton!: HTMLButtonElement;
  playingBarSongTitle!: HTMLElement;
  playingBarArtist!: HTMLElement;
  playingBarVideoTitle!: HTMLElement;
  playingBarPostDate!: HTMLElement;
  playingBarStatus!: HTMLButtonElement;
  playingBarPlay!: HTMLElement;
  playingBarPause!: HTMLElement;

  menuButton!: HTMLButtonElement;
  menuControllerRepeat!: HTMLButtonElement;
  menuControllerPrev!: HTMLButtonElement;
  menuControllerStatus!: HTMLButtonElement;
  menuControllerPlay!: HTMLElement;
  menuControllerPause!: HTMLElement;
  menuControllerNext!: HTMLButtonElement;
  menuControllerShuffle!: HTMLButtonElement;
  menuTimeSeekBar!: HTMLInputElement;
  menuTimeTextNow!: HTMLElement;
  menuTimeTextWhole!: HTMLElement;

  tracks!: HTMLUListElement;
  toPageTop!: HTMLElement;

  constructor() {
    this.init();
  }

  init(): void {
    // 検索関連
    this.searchForm = document.getElementById("searchForm") as HTMLFormElement;
    this.searchText = document.getElementById("searchText") as HTMLInputElement;
    this.searchOptionSongTitle = document.getElementById("searchOptionSongTitle") as HTMLInputElement;
    this.searchOptionArtist = document.getElementById("searchOptionArtist") as HTMLInputElement;
    this.searchOptionVideoTitle = document.getElementById("searchOptionVideoTitle") as HTMLInputElement;
    this.searchOptionPostDate = document.getElementById("searchOptionPostDate") as HTMLInputElement;
    this.searchOptionShare = document.getElementById("searchOptionShare") as HTMLAnchorElement;
    this.toClearSearchValue = document.getElementById("toClearSearchValue") as HTMLButtonElement;
    this.entireNum = document.getElementById("entireNum") as HTMLElement;
    this.searchResultNum = document.getElementById("searchResultNum") as HTMLElement;

    // プレイヤー関連
    this.playingBarThumb = document.getElementById("playingBarThumb") as HTMLImageElement;
    this.playingBarThumbButton = document.getElementById("playingBarThumbButton") as HTMLButtonElement;
    this.playingBarSongTitle = document.getElementById("playingBarSongTitle") as HTMLElement;
    this.playingBarArtist = document.getElementById("playingBarArtist") as HTMLElement;
    this.playingBarVideoTitle = document.getElementById("playingBarVideoTitle") as HTMLElement;
    this.playingBarPostDate = document.getElementById("playingBarPostDate") as HTMLElement;
    this.playingBarStatus = document.getElementById("playingBarStatus") as HTMLButtonElement;
    this.playingBarPlay = document.getElementById("playingBarPlay") as HTMLElement;
    this.playingBarPause = document.getElementById("playingBarPause") as HTMLElement;

    // メニュー関連
    this.menuButton = document.getElementById("menuButton") as HTMLButtonElement;
    this.menuControllerRepeat = document.getElementById("menuControllerRepeat") as HTMLButtonElement;
    this.menuControllerPrev = document.getElementById("menuControllerPrev") as HTMLButtonElement;
    this.menuControllerStatus = document.getElementById("menuControllerStatus") as HTMLButtonElement;
    this.menuControllerPlay = document.getElementById("menuControllerPlay") as HTMLElement;
    this.menuControllerPause = document.getElementById("menuControllerPause") as HTMLElement;
    this.menuControllerNext = document.getElementById("menuControllerNext") as HTMLButtonElement;
    this.menuControllerShuffle = document.getElementById("menuControllerShuffle") as HTMLButtonElement;
    this.menuTimeSeekBar = document.getElementById("menuTimeSeekBar") as HTMLInputElement;
    this.menuTimeTextNow = document.getElementById("menuTimeTextNow") as HTMLElement;
    this.menuTimeTextWhole = document.getElementById("menuTimeTextWhole") as HTMLElement;

    // その他
    this.tracks = document.getElementById("tracks") as HTMLUListElement;
    this.toPageTop = document.getElementById("toPageTop") as HTMLElement;
  }
}

export default DOMElements;
