const book = SpreadsheetApp.getActiveSpreadsheet();

const sheets = ((book) => {
  const handler = {
    get(target, prop) {
      if (target[prop]) return target[prop];

      const sheet = book.getSheetByName(prop);
      target[prop] = sheet;

      return sheet;
    },
  };

  return new Proxy({}, handler);
})(book);

const currentDate = Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd HH:mm z");
