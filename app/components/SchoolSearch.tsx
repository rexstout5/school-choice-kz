"use client";

import { useMemo, useState } from "react";
import { cities, schools, types } from "../data/schools";
import { SchoolCard } from "./SchoolCard";

export function SchoolSearch() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");

  const filteredSchools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return schools.filter((school) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [school.name, school.city, school.district, school.description, ...school.curriculum, ...school.features]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCity = city === "all" || school.city === city;
      const matchesType = type === "all" || school.type === type;

      return matchesQuery && matchesCity && matchesType;
    });
  }, [city, query, type]);

  return (
    <section className="catalog-section" aria-label="Поиск и фильтры школ">
      <div className="filters-panel">
        <label>
          Поиск по школе, району или программе
          <input
            type="search"
            placeholder="Например: STEM, Алматы, IELTS"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          Город
          <select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="all">Все города</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Тип школы
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">Все типы</option>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="catalog-summary">
        <p>Найдено школ: {filteredSchools.length}</p>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setCity("all");
            setType("all");
          }}
        >
          Сбросить фильтры
        </button>
      </div>

      {filteredSchools.length > 0 ? (
        <div className="school-grid">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.slug} school={school} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Ничего не найдено</h2>
          <p>Попробуйте изменить город, тип школы или поисковый запрос.</p>
        </div>
      )}
    </section>
  );
}
