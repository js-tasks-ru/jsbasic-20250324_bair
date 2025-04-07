function filterRange(arr, a, b) {
  return arr.filter(item => item >= Math.min(a, b) && item <= Math.max(a, b));
}
