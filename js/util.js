/**
 * エスケープされた文字列をエスケープ前の文字列に変換する
 * @param {string | any} str 逆エスケープしたい文字列
 * @returns {string | any} 逆エスケープされた文字列。引数がstring以外のときはそのまま返す。
 */

function unescapeHTML(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&#x60;/g, "`")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}
