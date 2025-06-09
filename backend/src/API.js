function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tracksSheet = ss.getSheetByName("tracks");
  const videosSheet = ss.getSheetByName("videos");

  const tracks = getFilteredData(tracksSheet, isValidTrack, ["videoTitle", "postDate", "status"]);
  const videos = getVideoMap(videosSheet, ["status", "duration"]);

  const result = { tracks, videos };

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// 共通処理：シートからオブジェクト配列を取得し、フィルタ + 除外フィールド処理
function getFilteredData(sheet, filterFn, excludeFields = []) {
  const [headers, ...rows] = sheet.getDataRange().getValues();

  return rows
    .map((row) => toObject(headers, row))
    .filter(filterFn)
    .map((obj) => omitFields(obj, excludeFields));
}

// videos専用：videoId をキーにしたマップに整形
function getVideoMap(sheet, excludeFields = []) {
  const [headers, ...rows] = sheet.getDataRange().getValues();

  return rows.reduce((map, row) => {
    const video = omitFields(toObject(headers, row), excludeFields);
    const { id, title, postDate } = video;

    if (id) {
      map[id] = { title, postDate };
    }

    return map;
  }, {});
}

// オブジェクト化：ヘッダーと値の配列を {key: value} に
function toObject(keys, values) {
  return keys.reduce((obj, key, i) => {
    obj[key] = values[i];
    return obj;
  }, {});
}

// 特定フィールドを除外したオブジェクトを返す
function omitFields(obj, fields) {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !fields.includes(key)));
}

// tracks用のバリデーション関数
function isValidTrack(track) {
  const requiredFields = ["videoId", "title", "artist"];
  const hasRequiredFields = requiredFields.every((field) => track[field] !== "");

  const timeRangeValid =
    (!track.startSeconds && !track.endSeconds) || (track.startSeconds && track.endSeconds);

  return track.status === "public" && hasRequiredFields && timeRangeValid;
}
