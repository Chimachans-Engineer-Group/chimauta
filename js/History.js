class History {
  #list;
  #currentIndex;

  constructor(currentTrackNum) {
    this.#list = [currentTrackNum];
    this.#currentIndex = 0;
  }

  getPrevTrackNum() {
    this.#currentIndex = this.#currentIndex - 1 < 0 ? this.#currentIndex - 1 : 0;
    const prevTrackNum = this.#list[this.#currentIndex];
    return prevTrackNum;
  }

  getCurrentTrackNum() {
    const currentTrackNum = this.#list[this.#currentIndex];
    return currentTrackNum;
  }

  enqueue(trackNum) {
    this.#list.push(trackNum);
    this.#currentIndex += 1;
  }
}
