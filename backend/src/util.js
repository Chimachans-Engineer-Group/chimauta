/**
 * シートの指定された範囲内の秒数を時間、分、秒の形式の計算式に置き換える関数。
 * 変換された式は元のセルに上書きされる。
 */
function convertSecondsToFormulaInSheet() {
  const lastRow = sheets.tracks.getLastRow();
  const secondsColumnsRange = sheets.tracks.getRange(2, 4, lastRow - 1, 2);
  const secondsColumns = secondsColumnsRange.getValues();

  const replacedSecondsColumns = secondsColumns.map((array) =>
    array.map((seconds) => {
      if (typeof seconds !== "number") return seconds;

      // 時間、分、秒の値を計算
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      // 各時間単位を含む式を生成
      const formulaParts = [];
      if (hours > 0) formulaParts.push(`${hours}*3600`);
      if (minutes > 0) formulaParts.push(`${minutes}*60`);
      formulaParts.push(`${secs}`);

      return `=${formulaParts.join("+")}`; // 式を結合
    })
  );
  secondsColumnsRange.setValues(replacedSecondsColumns);
}

/**
 * ISO 8601 duration 文字列を秒数に変換する関数。
 *
 * @param {string} duration ISO 8601 duration 文字列（例: "PT1H30M"）
 * @returns {number} 変換された秒数
 */
function durationToSeconds(duration) {
  if (!duration) return 0;
  const regex =
    /P(?:([\d,.]+)Y)?(?:([\d,.]+)M)?(?:([\d,.]+)D)?(?:T(?:([\d,.]+)H)?(?:([\d,.]+)M)?(?:([\d,.]+)S)?)?/;
  const matches = duration.match(regex);

  const years = matches[1] ? parseFloat(matches[1]) * 365 * 24 * 60 * 60 : 0;
  const months = matches[2] ? parseFloat(matches[2]) * 30 * 24 * 60 * 60 : 0;
  const days = matches[3] ? parseFloat(matches[3]) * 24 * 60 * 60 : 0;
  const hours = matches[4] ? parseFloat(matches[4]) * 60 * 60 : 0;
  const minutes = matches[5] ? parseFloat(matches[5]) * 60 : 0;
  const seconds = matches[6] ? parseFloat(matches[6]) : 0;

  return years + months + days + hours + minutes + seconds;
}
