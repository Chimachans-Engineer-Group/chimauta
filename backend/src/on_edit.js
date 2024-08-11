function getAdditionalInformation() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("シート1");
  const activeCell = sheet.getActiveCell();

  // videoId, startSeconds, endSecondsの列以外が編集されたときはreturn
  switch (activeCell.getColumn()) {
    case 1:
    case 4:
    case 5:
      break;
    default:
      return;
  }

  const lastRow = sheet.getLastRow();
  const videoInfoOnSheet = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  const videoIdsOnSheet = videoInfoOnSheet.map((v) => v[0]);
  const collectionOfvideoIdsOnSheet = Array.from(new Set(videoIdsOnSheet));

  const maxQuantityCanCall = 50;
  const numOfCalls = Math.ceil(collectionOfvideoIdsOnSheet.length / maxQuantityCanCall);
  const tmp = [];
  for (let i = 0; i < numOfCalls; i++) {
    const videoIdsToCall = collectionOfvideoIdsOnSheet.splice(0, maxQuantityCanCall);
    const responseFromYouTube = YouTube.Videos.list("snippet, contentDetails, status", {
      id: videoIdsToCall,
      fields:
        "items(id, snippet(title, publishedAt), contentDetails(duration), status(privacyStatus))",
    }).items;
    tmp.push(responseFromYouTube);
  }
  const videoInfo = tmp.flat();

  const fetchedvideoIds = videoInfo.map((v) => v.id);

  let alertFlag = 0;
  let alertMessage =
    "【エラー】\n指定されたvideoIdが見つかりませんでした。\n正しく入力されているか確認してください。\n";
  const tableToInsert = videoInfoOnSheet.map((obj, index) => {
    const [videoId, songTitle, artist, startSeconds, endSeconds] = obj;

    // videoIdが空欄のときは空の4列をreturn
    if (!videoId) return ["", "", "", ""];

    const matchedVideoIdRow = fetchedvideoIds.indexOf(videoId);
    // sheet上のvideoIdがYouTubeからのresponseに含まれていないとき
    if (matchedVideoIdRow === -1) {
      alertFlag = 1;
      const currentRow = Number(index) + 2;
      alertMessage += "\n" + currentRow + " 行：" + videoId;

      return ["", "", "", ""];
    }

    const videoTitle = videoInfo[matchedVideoIdRow].snippet.title;
    const postDate = Utilities.formatDate(
      new Date(videoInfo[matchedVideoIdRow].snippet.publishedAt),
      "JST",
      "yyyy-MM-dd HH:mm z"
    ).toString();
    const privacyStatus = videoInfo[matchedVideoIdRow].status.privacyStatus;
    const duration =
      !!startSeconds && !!endSeconds
        ? endSeconds - startSeconds
        : durationToSeconds(videoInfo[matchedVideoIdRow].contentDetails.duration);

    return [videoTitle, postDate, privacyStatus, duration];
  });

  sheet.getRange(2, 6, tableToInsert.length, 4).setValues(tableToInsert);

  if (alertFlag) {
    const ui = SpreadsheetApp.getUi();
    ui.alert(alertMessage);
  }
}
