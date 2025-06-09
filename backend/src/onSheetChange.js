function onSheetChange(e) {
  const sheet = e.source.getSheetName();
  const column = e.range.getColumn();
  console.log("sheet: " + sheet);
  console.log("column: " + column);

  if (sheet !== "tracks" || column !== 1) return;

  fetchAndAppendVideoInfo();
}

function fetchAndAppendVideoInfo() {
  const videoIds = getUniqueVideoIdsFromSheet();
  console.log("videoIds:\n" + videoIds);
  if (videoIds.length === 0) return;

  const videoInfo = fetchVideoInfoFromYouTube(videoIds);
  console.log("videoInfo:\n" + videoInfo);
  if (videoInfo.length === 0) return;

  writeVideoInfoToSheet(videoInfo);
  alertMissingVideoIds(
    videoIds,
    videoInfo.map((v) => v.id)
  );
}

function getUniqueVideoIdsFromSheet() {
  const lastRow = sheets.tracks.getLastRow();
  const videoIds = sheets.tracks
    .getRange(2, 1, lastRow - 1)
    .getValues()
    .flat();
  return [...new Set(videoIds)].filter(Boolean); // 重複と空白を除外
}

function fetchVideoInfoFromYouTube(videoIds) {
  const maxBatchSize = 50;
  const batches = [];

  for (let i = 0; i < videoIds.length; i += maxBatchSize) {
    const batch = videoIds.slice(i, i + maxBatchSize);
    const response = YouTube.Videos.list("snippet,contentDetails,status", {
      id: batch.join(","),
      fields: "items(id,snippet(title,publishedAt),contentDetails(duration),status(privacyStatus))",
    });
    batches.push(...(response.items || []));
  }

  return batches;
}

function writeVideoInfoToSheet(videoInfo) {
  const data = videoInfo.map((video) => [
    video.id,
    video.snippet.title,
    Utilities.formatDate(new Date(video.snippet.publishedAt), "JST", "yyyy-MM-dd HH:mm z"),
    durationToSeconds(video.contentDetails.duration),
    video.status.privacyStatus,
  ]);

  sheets.videos.getRange(2, 1, data.length, data[0].length).setValues(data);
}

function alertMissingVideoIds(expectedIds, fetchedIds) {
  const missing = expectedIds.filter((id) => !fetchedIds.includes(id));
  console.log("missing:\n" + missing);
  if (missing.length === 0) return;

  const message = [
    "【エラー】",
    "指定されたvideoIdが見つかりませんでした。",
    "正しく入力されているか確認してください。\n",
    ...missing,
  ].join("\n");

  SpreadsheetApp.getUi().alert(message);
}
