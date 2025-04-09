function highlight(table) {
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    const statusCell = row.querySelector('td[data-available]');
    const genderCell = row.querySelector('td:nth-child(3)');
    const ageCell = row.querySelector('td:nth-child(2)');

    if (statusCell) {
      const isAvailable = statusCell.dataset.available === 'true';
      row.classList.add(isAvailable ? 'available' : 'unavailable');
    } else {
      row.hidden = true;
    }


    if (genderCell) {
      const gender = genderCell.textContent.trim();
      row.classList.add(gender === 'm' ? 'male' : 'female');
    }

    if (ageCell) {
      const age = parseInt(ageCell.textContent, 10);
      if (age < 18) {
        row.style.textDecoration = 'line-through';
      }
    }
  });
}