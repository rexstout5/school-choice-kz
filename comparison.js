const summary = document.querySelector('#comparison-summary');
const clearButton = document.querySelector('#clear-comparison');
const emptyState = document.querySelector('#empty-state');
const tableWrapper = document.querySelector('#comparison-table-wrapper');

function programsList(programs) {
  return `<ul class="comparison-programs">${programs.map((program) => `<li>${program}</li>`).join('')}</ul>`;
}

function renderComparison() {
  const selectedSchools = schoolHelpers.getSelectedSchools();
  const hasSchools = selectedSchools.length > 0;

  summary.textContent = hasSchools
    ? `${selectedSchools.length} ${selectedSchools.length === 1 ? 'school' : 'schools'} selected for comparison.`
    : 'No schools selected for comparison.';
  emptyState.hidden = hasSchools;
  tableWrapper.hidden = !hasSchools;
  clearButton.disabled = !hasSchools;

  if (!hasSchools) {
    tableWrapper.innerHTML = '';
    return;
  }

  const columns = selectedSchools.map((school) => `<th scope="col">${school.name}</th>`).join('');
  const row = (label, values) => `
    <tr>
      <th scope="row">${label}</th>
      ${values.map((value) => `<td>${value}</td>`).join('')}
    </tr>
  `;

  tableWrapper.innerHTML = `
    <table class="comparison-table">
      <caption>Side-by-side school comparison</caption>
      <thead>
        <tr>
          <th scope="col">Feature</th>
          ${columns}
        </tr>
      </thead>
      <tbody>
        ${row('Rating', selectedSchools.map((school) => `★ ${school.rating} / 5`))}
        ${row('Language', selectedSchools.map((school) => school.language))}
        ${row('Monthly price', selectedSchools.map((school) => schoolHelpers.formatPrice(school.monthlyPrice)))}
        ${row('Class size', selectedSchools.map((school) => `${school.classSize} students`))}
        ${row('Programs', selectedSchools.map((school) => programsList(school.programs)))}
      </tbody>
    </table>
  `;
}

clearButton.addEventListener('click', () => {
  schoolHelpers.saveSelectedIds([]);
  renderComparison();
});

renderComparison();
