class UserTable {
  constructor(rows) {
    this._rows = rows;
    this._elem = this._createTable();
  }

  get elem() {
    return this._elem;
  }

  _createTable() {
    const table = document.createElement('table');
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Имя', 'Возраст', 'Зарплата', 'Город', ''].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    this._rows.forEach(rowData => {
      const row = this._createRow(rowData);
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    table.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        const row = event.target.closest('tr');
        row.remove();
      }
    });
    
    return table;
  }

  _createRow(rowData) {
    const row = document.createElement('tr');
    
    ['name', 'age', 'salary', 'city'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = rowData[key];
      row.appendChild(td);
    });
    
    const deleteTd = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteTd.appendChild(deleteButton);
    row.appendChild(deleteTd);
    
    return row;
  }
}