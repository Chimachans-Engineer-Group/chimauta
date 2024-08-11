function replaceSecondsWithFormula() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("シート1");
  const lastRow = sheet.getLastRow();
  const secondsColumnsRange = sheet.getRange(2, 4, lastRow - 1, 2);
  const secondsColumns = secondsColumnsRange.getValues();

  const replacedSecondsColumns = secondsColumns.map((array) =>
    array.map((seconds) =>
      typeof seconds === "number" ? convertFromSecondsToFormula(seconds) : seconds
    )
  );
  secondsColumnsRange.setValues(replacedSecondsColumns);

  function convertFromSecondsToFormula(seconds) {
    const hour = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minute = Math.floor(seconds / 60);
    seconds %= 60;

    let formula = "=";
    if (hour) {
      formula += `${hour}*3600`;
      if (minute || seconds) {
        formula += "+";
      }
    }
    if (minute) {
      formula += `${minute}*60`;
      if (seconds) {
        formula += "+";
      }
    }
    if (seconds) {
      formula += seconds;
    }
    return formula;
  }
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
