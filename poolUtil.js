const asc = (arr) => arr.sort((a, b) => a - b);

const quantile = (arr, q) => {
  const sorted = asc(arr);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

const q25 = (arr) => quantile(arr, 0.25);

const q50 = (arr) => quantile(arr, 0.5);

const q75 = (arr) => quantile(arr, 0.75);

const median = (arr) => q50(arr);

module.exports = {
  quantile,
  q25,
  q50,
  q75,
  median,
};
