export default function SchoolNotFound() {
  return (
    <main className="school-not-found">
      <section className="school-detail__section">
        <p className="hero__kicker">School profile</p>
        <h1>School not found</h1>
        <p>The school profile is unavailable or the link is invalid.</p>
        <a className="button-link" href="/">
          Back to catalog
        </a>
      </section>
    </main>
  );
}
