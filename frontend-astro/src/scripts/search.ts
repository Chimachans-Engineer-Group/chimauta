import CONSTANTS from "./constants";
import type DOMElements from "./dom";
import type AppState from "./state";

class SearchManager {
  dom: DOMElements;
  state: AppState;
  debounceTimer: ReturnType<typeof setTimeout> | null = null;
  trackElements: (HTMLElement | null)[] | null = null;

  constructor(domElements: DOMElements, state: AppState) {
    this.dom = domElements;
    this.state = state;
  }

  initSearch(): void {
    this.dom.searchForm.addEventListener("input", () => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.performSearch();
      }, 150);
    });

    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      '#searchOption input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.performSearch();
      });
    });

    this.dom.searchText.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
      }
    });

    this.dom.toClearSearchValue.addEventListener("click", () => {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.dom.searchText.value = "";
      this.dom.searchText.focus();
      this.performSearch();
    });
  }

  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  performSearch(): void {
    if (!this.trackElements && this.state.songList) {
      this.trackElements = this.state.songList.map((_, i) =>
        document.getElementById(`trackNum${i}`)
      );
    }

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

    const searchWordRegex = new RegExp(this.escapeRegExp(searchWord), "i");

    this.state.searchResult = this.state.songList.flatMap((track, i) => {
      const video = this.state.videoList[track.videoId];
      const videoTitle = video ? video.title : "";
      const postDate = video ? video.postDate : "";

      const testOfSongTitle = songTitleChecked && searchWordRegex.test(track.title);
      const testOfArtist = artistChecked && searchWordRegex.test(track.artist);
      const testOfVideoTitle = videoTitleChecked && searchWordRegex.test(videoTitle);
      const testOfPostDate = postDateChecked && searchWordRegex.test(postDate);

      const beingProcessedTrackRow = this.trackElements
        ? this.trackElements[i]
        : document.getElementById(`trackNum${i}`);

      if (beingProcessedTrackRow) {
        if (testOfSongTitle || testOfArtist || testOfVideoTitle || testOfPostDate) {
          beingProcessedTrackRow.classList.remove("to-hide");
          return i;
        } else {
          beingProcessedTrackRow.classList.add("to-hide");
          return [];
        }
      }
      return [];
    });

    this.dom.searchResultNum.textContent = String(this.state.searchResult.length);
    this.state.shuffleQueue = [];
  }

  updatePageTitle(searchWord: string): void {
    const currentTitle = `${
      searchWord !== "" ? `${searchWord} - ` : ""
    }ちまうた｜町田ちま非公式ファンサイト`;
    document.title = currentTitle;
  }

  updateURLAndShare(
    searchWord: string,
    songTitleChecked: boolean,
    artistChecked: boolean,
    videoTitleChecked: boolean,
    postDateChecked: boolean
  ): void {
    const shareURL = location.origin;
    const currentShareURL = new URL(shareURL);
    currentShareURL.search = new URLSearchParams({
      q: searchWord,
      type: [songTitleChecked, artistChecked, videoTitleChecked, postDateChecked]
        .map((v) => Number(v))
        .join(""),
    }).toString();
    history.replaceState("", document.title, currentShareURL.toString());

    const baseURL = CONSTANTS.TWITTER_INTENT_URL;
    const currentBaseURL = new URL(baseURL);
    currentBaseURL.search = new URLSearchParams({
      url: currentShareURL.toString(),
      text: document.title,
    }).toString();
    this.dom.searchOptionShare.href = currentBaseURL.toString();
  }

  updateClearButton(searchWord: string): void {
    if (searchWord === "") {
      this.dom.toClearSearchValue.classList.add("invisible");
    } else {
      this.dom.toClearSearchValue.classList.remove("invisible");
    }
  }

  handleURLParams(): void {
    const searchParams = new URLSearchParams(window.location.search);
    const queryKeyName = "q";
    if (searchParams.has(queryKeyName)) {
      const typeKeyName = "type";
      const query = searchParams.get(queryKeyName) ?? "";
      const type = searchParams.get(typeKeyName);
      this.dom.searchText.value = query;
      if (type) {
        this.dom.searchOptionSongTitle.checked = type.charAt(0) === "1";
        this.dom.searchOptionArtist.checked = type.charAt(1) === "1";
        this.dom.searchOptionVideoTitle.checked = type.charAt(2) === "1";
        this.dom.searchOptionPostDate.checked = type.charAt(3) === "1";
      }
      this.performSearch();
      if (this.state.searchResult.length > 0) {
        this.state.nowSongNum = this.state.searchResult[this.state.searchResult.length - 1];
      }
    }
  }
}

export default SearchManager;
