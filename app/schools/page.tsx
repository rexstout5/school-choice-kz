import { SchoolSearch } from "../components/SchoolSearch";

export const metadata = {
  title: "Каталог школ — School Choice KZ"
};

export default function SchoolsPage() {
  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">Каталог школ</p>
        <h1>Найдите школу по городу, типу и образовательному профилю</h1>
        <p>
          Используйте поиск и фильтры, чтобы быстро составить короткий список школ для знакомства и визитов.
        </p>
      </section>
      <SchoolSearch />
    </main>
  );
}
