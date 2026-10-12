import CONSTANTS from "./constants";
import type { ApiResponse, Track, VideoList } from "./types";

const CACHE_KEY = "chimauta_data_cache";

class DataManager {
  apiUrl: string;

  constructor() {
    this.apiUrl = CONSTANTS.API_URL;
  }

  async fetchData(): Promise<ApiResponse> {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as ApiResponse;
          if (parsed && Array.isArray(parsed.tracks) && parsed.videos) {
            return parsed;
          }
        } catch {
          sessionStorage.removeItem(CACHE_KEY);
        }
      }

      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as ApiResponse;
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (storageError) {
        console.warn("Failed to save data to sessionStorage:", storageError);
      }
      return data;
    } catch (error) {
      console.error("Data fetch error:", error);
      throw error;
    }
  }

  processData(data: ApiResponse): { songList: Track[]; videoList: VideoList } {
    const songList = data.tracks;
    const videoList = data.videos;

    return { songList, videoList };
  }
}

export default DataManager;
