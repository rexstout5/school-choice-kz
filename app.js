const grid = document.querySelector('#school-grid');
const selectionCount = document.querySelector('#selection-count');
const compareLink = document.querySelector('#compare-link');

function updateSelectionState() {
  const selectedIds = schoolHelpers.getSelectedIds();
  const count = selectedIds.length;

  selectionCount.textContent = `${count} ${count === 1 ? 'school' : 'schools'} selected`;
  compareLink.textContent = count > 0 ? `Compare ${count} selected` : 'Compare selected schools';

  document.querySelectorAll('[data-school-checkbox]').forEach((checkbox) => {
    const checked = selectedIds.includes(checkbox.value);
    checkbox.checked = checked;
    checkbox.disabled = !checked && count >= schoolHelpers.maxComparisonSchools;
  });
}

function toggleSchool(id, checked) {
  const selectedIds = schoolHelpers.getSelectedIds();
  const nextIds = checked
    ? [...selectedIds, id].slice(0, schoolHelpers.maxComparisonSchools)
    : selectedIds.filter((selectedId) => selectedId !== id);

  schoolHelpers.saveSelectedIds([...new Set(nextIds)]);
  updateSelectionState();
}

function renderSchools() {
  grid.innerHTML = schools.map((school) => `
    <article class="school-card">
      <div class="school-card__header">
        <div>
          <p class="district">${school.district}</p>
          <h2>${school.name}</h2>
        </div>
        <span class="rating" aria-label="Rating ${school.rating} out of 5">★ ${school.rating}</span>
      </div>
      <dl class="school-facts">
        <div><dt>Language</dt><dd>${school.language}</dd></div>
        <div><dt>Monthly price</dt><dd>${schoolHelpers.formatPrice(school.monthlyPrice)}</dd></div>
        <div><dt>Class size</dt><dd>${school.classSize} students</dd></div>
      </dl>
      <div class="programs">
        <strong>Programs</strong>
        <ul>${school.programs.map((program) => `<li>${program}</li>`).join('')}</ul>
      </div>
      <label class="select-school">
        <input type="checkbox" value="${school.id}" data-school-checkbox>
        Add to comparison
      </label>
    </article>
  `).join('');

  document.querySelectorAll('[data-school-checkbox]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      toggleSchool(event.target.value, event.target.checked);
    });
  });

  updateSelectionState();
}

renderSchools();
