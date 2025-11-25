function doGet(e) {
  const tracksLastRow = sheets.tracks.getLastRow();
  const videosLastRow = sheets.videos.getLastRow();
  const tracksValues = sheets.tracks.getRange(1, 1, tracksLastRow, 7).getValues();
  const videosValues = sheets.videos.getRange(1, 1, videosLastRow, 3).getValues();

  const tracks = getTrackObjects(tracksValues, ["isValidTrack"]);
  const videos = getVideoMap(videosValues);

  const result = { tracks, videos };

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getTrackObjects(tracksValues, excludeFields = []) {
  const [headers, ...rows] = tracksValues;

  return rows
    .map((row) => toObject(headers, row))
    .filter((obj) => obj.isValidTrack)
    .map((obj) => omitFields(obj, excludeFields));
}

function getVideoMap(videosValues, excludeFields = []) {
  const [headers, ...rows] = videosValues;

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
