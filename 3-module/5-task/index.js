function getMinMax(str) {
  const parts = str.split(' ');
  const numbers = [];

  for (const part of parts) {
    const number = parseFloat(part);
    if (!isNaN(number)) {
      numbers.push(number);
    }
  }

  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return { min, max };
}
