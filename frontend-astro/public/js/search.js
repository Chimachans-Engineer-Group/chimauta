import CONSTANTS from "./constants.js";

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

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

    const searchWordRegex = new RegExp(this.escapeRegExp(searchWord), "i");

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
