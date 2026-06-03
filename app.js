const schools = [
  {
    name: "Nazarbayev Intellectual School Astana",
    district: "Astana - Yesil",
    minAge: 12,
    maxAge: 18,
    monthlyTuition: 0,
    languages: ["Kazakh", "Russian", "English", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["Olympiad preparation", "Trilingual STEM curriculum", "Research clubs"],
  },
  {
    name: "Haileybury Astana",
    district: "Astana - Yesil",
    minAge: 4,
    maxAge: 18,
    monthlyTuition: 690000,
    languages: ["English", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["British curriculum", "Robotics and design labs", "Broad enrichment program"],
  },
  {
    name: "Spectrum International School",
    district: "Astana - Almaty",
    minAge: 5,
    maxAge: 18,
    monthlyTuition: 290000,
    languages: ["English", "Kazakh", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["International pathway", "Coding electives", "Strong language support"],
  },
  {
    name: "Bilim-Innovation Lyceum Astana",
    district: "Astana - Saryarka",
    minAge: 11,
    maxAge: 18,
    monthlyTuition: 90000,
    languages: ["Kazakh", "English", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["Math-science focus", "Competitive academic clubs", "Affordable tuition"],
  },
  {
    name: "Miras International School Almaty",
    district: "Almaty - Bostandyk",
    minAge: 3,
    maxAge: 18,
    monthlyTuition: 520000,
    languages: ["English", "Russian", "Kazakh", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["IB programs", "Innovation studio", "Arts and sports electives"],
  },
  {
    name: "Haileybury Almaty",
    district: "Almaty - Medeu",
    minAge: 4,
    maxAge: 18,
    monthlyTuition: 720000,
    languages: ["English", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["British curriculum", "University counseling", "Science enrichment"],
  },
  {
    name: "Almaty School Lyceum 165",
    district: "Almaty - Almaly",
    minAge: 6,
    maxAge: 17,
    monthlyTuition: 0,
    languages: ["Russian", "Kazakh", "Multilingual"],
    afterSchool: true,
    advancedStem: false,
    strengths: ["Established local reputation", "Accessible commute", "After-school clubs"],
  },
  {
    name: "QSI International School of Almaty",
    district: "Almaty - Bostandyk",
    minAge: 3,
    maxAge: 18,
    monthlyTuition: 610000,
    languages: ["English"],
    afterSchool: true,
    advancedStem: false,
    strengths: ["American-style mastery learning", "International community", "Student support"],
  },
  {
    name: "Dostyk School Shymkent",
    district: "Shymkent - Karatau",
    minAge: 6,
    maxAge: 17,
    monthlyTuition: 160000,
    languages: ["Kazakh", "Russian", "Multilingual"],
    afterSchool: true,
    advancedStem: true,
    strengths: ["Exam preparation", "STEM electives", "Extended day option"],
  },
  {
    name: "Aktobe Innovation School",
    district: "Aktobe - Astana",
    minAge: 6,
    maxAge: 17,
    monthlyTuition: 135000,
    languages: ["Kazakh", "Russian"],
    afterSchool: false,
    advancedStem: true,
    strengths: ["Project-based science", "Kazakh-medium instruction", "Regional competitions"],
  },
];

const form = document.querySelector("#quizForm");
const districtSelect = document.querySelector("#district");
const results = document.querySelector("#results");
const matchCount = document.querySelector("#matchCount");
const resetButton = document.querySelector("#resetButton");

const formatter = new Intl.NumberFormat("kk-KZ", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

function populateDistricts() {
  const districts = [...new Set(schools.map((school) => school.district))].sort();
  districtSelect.innerHTML = ["Any district", ...districts]
    .map((district) => `<option value="${district}">${district}</option>`)
    .join("");
}

function getPreferences() {
  const data = new FormData(form);

  return {
    age: Number(data.get("age")),
    district: data.get("district"),
    budget: Number(data.get("budget")),
    language: data.get("language"),
    afterSchool: data.get("afterSchool") === "yes",
    stem: data.get("stem") === "yes",
  };
}

function scoreSchool(school, preferences) {
  let score = 0;
  const reasons = [];

  if (preferences.age >= school.minAge && preferences.age <= school.maxAge) {
    score += 30;
    reasons.push(`Accepts students aged ${school.minAge}-${school.maxAge}.`);
  } else {
    const ageGap = Math.min(
      Math.abs(preferences.age - school.minAge),
      Math.abs(preferences.age - school.maxAge),
    );
    score -= 12 + ageGap * 3;
    reasons.push(`Age range is ${school.minAge}-${school.maxAge}, so confirm eligibility.`);
  }

  if (preferences.district === "Any district") {
    score += 8;
    reasons.push("Included because you are open to any district.");
  } else if (school.district === preferences.district) {
    score += 22;
    reasons.push(`Located in your selected district: ${school.district}.`);
  } else {
    score -= 6;
    reasons.push(`Located in ${school.district}; consider commute time.`);
  }

  if (school.monthlyTuition <= preferences.budget) {
    score += 20;
    reasons.push(`${formatTuition(school.monthlyTuition)} monthly tuition fits your budget.`);
  } else {
    const overBudgetRatio = (school.monthlyTuition - preferences.budget) / preferences.budget;
    score -= Math.min(26, 8 + Math.round(overBudgetRatio * 18));
    reasons.push(`${formatTuition(school.monthlyTuition)} monthly tuition is above your budget.`);
  }

  if (school.languages.includes(preferences.language)) {
    score += 18;
    reasons.push(`Offers ${preferences.language} instruction.`);
  } else if (preferences.language === "Multilingual" && school.languages.length > 1) {
    score += 12;
    reasons.push("Offers more than one language pathway.");
  } else {
    score -= 10;
    reasons.push(`Primary languages: ${school.languages.join(", ")}.`);
  }

  if (!preferences.afterSchool) {
    score += 4;
  } else if (school.afterSchool) {
    score += 12;
    reasons.push("Has an after-school program.");
  } else {
    score -= 12;
    reasons.push("Does not currently list an after-school program.");
  }

  if (!preferences.stem) {
    score += 4;
  } else if (school.advancedStem) {
    score += 16;
    reasons.push("Provides advanced STEM education.");
  } else {
    score -= 14;
    reasons.push("STEM is available at a standard level rather than advanced track.");
  }

  return {
    ...school,
    score: Math.max(0, Math.min(100, score)),
    reasons,
  };
}

function formatTuition(tuition) {
  return tuition === 0 ? "No listed tuition" : formatter.format(tuition);
}

function recommendSchools(preferences) {
  return schools
    .map((school) => scoreSchool(school, preferences))
    .sort((a, b) => b.score - a.score || a.monthlyTuition - b.monthlyTuition)
    .slice(0, 5);
}

function renderRecommendations(recommendations) {
  const strongMatches = recommendations.filter((school) => school.score >= 55);
  const visibleRecommendations = strongMatches.length > 0 ? strongMatches : recommendations.slice(0, 3);

  matchCount.textContent = `${visibleRecommendations.length} match${visibleRecommendations.length === 1 ? "" : "es"}`;
  results.className = "results-list";

  const fallbackNote = strongMatches.length === 0
    ? `<p class="fallback-note">No close matches found. Showing the nearest options so you can adjust budget, district, or program needs.</p>`
    : "";

  results.innerHTML = `
    ${fallbackNote}
    ${visibleRecommendations.map(renderSchoolCard).join("")}
  `;
}

function renderSchoolCard(school) {
  return `
    <article class="school-card">
      <div>
        <h3 class="school-card__title">
          ${school.name}
          ${school.advancedStem ? '<span class="badge">Advanced STEM</span>' : ""}
          ${school.afterSchool ? '<span class="badge">After-school</span>' : ""}
        </h3>
        <p class="school-meta">
          <span>${school.district}</span>
          <span>•</span>
          <span>Ages ${school.minAge}-${school.maxAge}</span>
          <span>•</span>
          <span>${formatTuition(school.monthlyTuition)}/month</span>
          <span>•</span>
          <span>${school.languages.join(", ")}</span>
        </p>
        <ul class="reason-list">
          ${school.reasons.slice(0, 5).map((reason) => `<li>${reason}</li>`).join("")}
          <li>Strengths: ${school.strengths.join(", ")}.</li>
        </ul>
      </div>
      <div class="score" aria-label="${school.score} percent match">${school.score}%</div>
    </article>
  `;
}

function resetQuiz() {
  form.reset();
  document.querySelector("#age").value = 7;
  districtSelect.value = "Any district";
  results.className = "results-empty";
  results.textContent = "Complete the quiz to see personalized recommendations.";
  matchCount.textContent = "0 matches";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderRecommendations(recommendSchools(getPreferences()));
});

resetButton.addEventListener("click", resetQuiz);

populateDistricts();
