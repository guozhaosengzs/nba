function columnSort(x, y, sortType) {
  let x1 = typeof x === "string" ? x.charCodeAt() : x;
  let y1 = typeof y === "string" ? y.charCodeAt() : y;

  for (
    let i = 1;
    x1 === y1 &&
    typeof x === "string" &&
    typeof y === "string" &&
    i < x.length &&
    i < y.length;
    i++
  ) {
    x1 = x.charCodeAt(i);
    y1 = y.charCodeAt(i);
  }

  [x, y] = [x1, y1];

  if (sortType === "asc") {
    return x - y;
  } else {
    return y - x;
  }
}

export default columnSort;
