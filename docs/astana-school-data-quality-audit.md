# Astana School Database Data Quality Audit

Audit date: 2026-06-11

## Official sources used

1. Electronic government of the Republic of Kazakhstan, “Контакты общеобразовательных школ городов Астана, Алматы, Шымкент и областных центров РК” (`egov.kz`), last modified 2025-08-25.
2. Astana education portal, “Каталог сайтов школ” (`astana-bilim.kz`).

## Audit scope

- Audited and rebuilt the application dataset with 40 real Astana schools.
- No school records were created without an official source.
- Core fields verified from `egov.kz`: official Russian name, address, district, phone, language of instruction.
- School website and Kazakh display name were cross-checked against the Astana education portal catalog where the catalog listed the school.
- Fields that were not verified in official sources were left empty in the database rather than filled with generated content.

## Schools successfully verified

The following 40 schools have verified core identity/contact information:

1. КГУ «Школа-лицей № 1»
2. ГКП на ПХВ "Школа-гимназия № 2 имени Гафу Кайырбекова"
3. ГКП на ПХВ «Школа-гимназия № 3»
4. ГКП на ПХВ «Школа-гимназия № 4 имени Жамбыла Жабаева» акимата города Астаны
5. КГУ "Гимназия №5"
6. ГКП на ПХВ «Гимназия № 6»
7. ГКП на ПХВ «Школа-гимназия №7 имени Гали Орманова»
8. ГКП на ПХВ «Школа-лицей № 8» акимата города Астаны
9. КГУ "Специализированная школа № 9 "Зерде"
10. КГУ «Школа-гимназия № 10 имени Жумабека Ташенева»
11. Коммунальное государственное учреждение «Школа-Лицей» № 11 Акимата города Нур-Султан имени Узбекали Жанибекова
12. КГУ «Комплекс «Детский сад – начальная школа № 12»
13. ГКП на ПХВ «Средняя школа № 13» акимата города Астаны
14. КГУ «Школа-гимназия № 14»
15. ГКП на ПХВ «Школа-лицей № 15»
16. КГУ "Средняя школа № 16 имени Т. Айбергенова"
17. ГКП на ПХВ «Школа-гимназия № 17 им. Акана Курманова»
18. ГКП на ПХВ «Средняя школа №18» акимата города Астаны
19. КГУ «Средняя школа № 19»
20. КГУ «Средняя школа № 20»
21. КГУ «Средняя школа № 21»
22. ГКП на ПХВ «Школа-гимназия № 22»
23. КГУ «Средняя школа № 23»
24. ГКП на ПХВ "Средняя школа №24"
25. КГУ «Средняя школа № 25»
26. ГКП на ПХВ «Школа- гимназия № 26»
27. ГКП на ПХВ "Школа-лицей № 27"
28. ГКП на ПХВ "Школа-лицей №28"
29. КГУ «Средняя школа № 29»
30. КГУ "Школа-гимназия № 30"
31. ГКП на ПХВ "Школа-гимназия №31" акимата города Астаны
32. КГУ "Школа-гимназия № 32"
33. КГУ «Комплекс «Детский сад – начальная школа № 33 им. Н.Абдирова»
34. КГУ «Средняя школа № 34»
35. ГКП на ПХВ «Школа-лицей № 35 имени Назира Торекулова» акимата города Астаны
36. КГУ "Средняя школа № 36"
37. ГКП на ПХВ «Школа-лицей № 37 им. Сырбая Мауленова»
38. ГКП на ПХВ «Школа-лицей № 38» акимата города Астаны
39. КГУ "Вечерняя (сменная) школа № 39"
40. КГУ «Школа-лицей № 40 им. Алькея Маргулана»

## Schools with missing information

All 40 records are partially verified because at least one user-requested field could not be verified from the official sources reviewed.

Common missing fields intentionally left empty:

- Official English name where not officially published.
- School description in Russian.
- School description in Kazakh.
- Admission information.
- After-school program.
- School bus.
- Class size.

One specific partial gap remains for school No. 11: the Astana education portal catalog page reviewed did not list a No. 11 entry in the visible catalog sequence, so `official_name_kk` is empty for that record.

## Duplicate schools

No duplicate `id` values, official Russian names, addresses, or phone numbers were found in the rebuilt 40-school dataset.

## Data policy applied

- The earlier generated English descriptions and invented program summaries were removed.
- Verified source fields were preserved only when they could be matched to official sources.
- Unsupported fields remain empty rather than inferred.
