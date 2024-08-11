function doGet() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  const data = getData(properties.ID, properties.SHEET_NAME);
  return ContentService.createTextOutput(JSON.stringify(data, null, 2)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getData(id, sheetName) {
  const sheet = SpreadsheetApp.openById(id).getSheetByName(sheetName);
  const table = sheet.getDataRange().getValues();
  const keys = table.shift();

  const data = table.flatMap((row) => {
    // 連想配列songを作る
    const song = {};
    row.forEach((col, c_i) => (song[keys[c_i]] = col));

    // 条件に合わないものを省く
    if (
      // statusはpubulicのみ
      song.status !== "public" ||
      // videoId, songTitle, artistはNOT NULL
      song.videoId === "" ||
      song.songTitle === "" ||
      song.artist === "" ||
      // startSecondsとendSecondsは両方空欄か両方入力済みの場合のみ
      !!song.startSeconds ^ !!song.endSeconds
    )
      return [];

    // song.statusはこの関数内でしか使わないので削除
    delete song.status;
    return song;
  });
  return data;
}
