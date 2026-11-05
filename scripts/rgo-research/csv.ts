export function encodeCsvRow(values: string[]): string {
  return values
    .map((value) => {
      const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replace(/"/g, '""')}"`;
    })
    .join(",");
}

export function decodeCsvCell(value: string): string {
  return /^'[\t\r\n ]*[=+\-@]/.test(value) ? value.slice(1) : value;
}

export function parseCsv(contents: string): string[][] {
  const text = contents.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let afterQuote = false;

  const finishRow = () => {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
    row = [];
    field = "";
    afterQuote = false;
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
          afterQuote = true;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (afterQuote) {
      if (character === ",") {
        row.push(field);
        field = "";
        afterQuote = false;
      } else if (character === "\n" || character === "\r") {
        if (character === "\r" && text[index + 1] === "\n") {
          index += 1;
        }
        finishRow();
      } else {
        throw new Error("CSV contains characters after a closing quote");
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      inQuotes = true;
    } else if (character === '"') {
      throw new Error("CSV contains a quote inside an unquoted field");
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      finishRow();
    } else {
      field += character;
    }
  }

  if (inQuotes) {
    throw new Error("CSV contains an unterminated quoted field");
  }
  if (field.length > 0 || row.length > 0 || afterQuote) {
    finishRow();
  }

  return rows;
}
