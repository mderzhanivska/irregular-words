
import { table } from '../../data';

const container = document.getElementById('data-table');
const search = document.getElementById('search-input');


function handleFocusSearch() {
  search.parentElement.classList.add('search-focus');
}

search.addEventListener('focus', handleFocusSearch, false);


function handleBlurSearch() {
  if (search.value.length === 0) {
    search.parentElement.classList.remove('search-focus');
  }
}

search.addEventListener('blur', handleBlurSearch, false);


function renderTable(data) {
  const rTable = document.createElement('table');
  const tr = rTable.insertRow(-1);

  rTable.columns.forEach((column) => {
    const th = document.createElement('th');
    th.innerHTML = column.title;
    tr.appendChild(th);
  });

  data.forEach((verb) => {
    const TR = rTable.insertRow(-1);

    rTable.columns.forEach((column) => {
      const tabCell = TR.insertCell(-1);
      tabCell.innerHTML = verb[column.key];
    });
  });

  container.innerHTML = '';
  container.appendChild(rTable);
}


function handleChangeSearch() {
  const filter = search.value.toUpperCase();

  const data = table.rows.filter(verb => (
    filter.length < 3
    || table.columns.some(column => verb[column.key].toUpperCase().includes(filter))
  ));

  renderTable(data);
}

renderTable(table.rows);
search.addEventListener('keyup', handleChangeSearch, false);
