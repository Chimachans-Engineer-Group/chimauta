import CONSTANTS from "./constants.js";

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
    const songList = data.tracks;
    const videoList = data.videos;

    return { songList, videoList };
  }
}

export default DataManager;
