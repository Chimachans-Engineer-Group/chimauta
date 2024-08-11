/**
 * HTMLエスケープをする
 * @param {string | any} str - HTMLエスケープが必要な文字列
 * @returns {string | any} HTMLエスケープされた文字列。引数がstring以外のときはそのまま返す。
 */
function escapeHTML(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.replace(/[&'`"<>]/g, (match) => {
    return {
      "&": "&amp;",
      "'": "&#x27;",
      "`": "&#x60;",
      '"': "&quot;",
      "<": "&lt;",
      ">": "&gt;",
    }[match];
  });
}
