import { schools } from '../../../src/data/schools.js';
import { getMapCoverageAudit } from '../../../src/lib/mapCoverageAudit.js';

export const metadata = {
  title: 'Admin debug · School map coverage'
};

export default function AdminDebugPage() {
  const audit = getMapCoverageAudit(schools, 'en');
  const statusRows = Object.entries(audit.coordinateStatusCounts);

  return (
    <main className="admin-debug-page">
      <section className="hero admin-debug-page__hero">
        <div>
          <p className="hero__kicker">Admin debug</p>
          <h1>School map coverage audit</h1>
          <p>Counts schools in the dataset, schools displayable on the map, and records still missing usable coordinates.</p>
        </div>
        <div className="hero__stat">
          <strong>{audit.coveragePercent}%</strong>
          <span>map coverage</span>
        </div>
      </section>

      <section className="debug-stat-grid" aria-label="School map coverage statistics">
        <article><span>Total schools in database</span><strong>{audit.totalSchools}</strong></article>
        <article><span>Schools displayed on map</span><strong>{audit.schoolsDisplayedOnMap}</strong></article>
        <article><span>Schools missing coordinates</span><strong>{audit.schoolsMissingCoordinates}</strong></article>
      </section>

      <section className="debug-panel">
        <h2>Coordinate status</h2>
        <dl className="debug-status-list">
          {statusRows.map(([status, count]) => (
            <div key={status}>
              <dt>{status}</dt>
              <dd>{count}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="debug-panel">
        <h2>Schools without coordinates</h2>
        {audit.schoolsWithoutCoordinates.length > 0 ? (
          <div className="debug-table-wrapper">
            <table className="debug-table">
              <thead><tr><th>School</th><th>District</th><th>Address</th><th>Status</th></tr></thead>
              <tbody>
                {audit.schoolsWithoutCoordinates.map((school) => (
                  <tr key={school.id}>
                    <td><a href={`/schools/${school.id}?lang=en`}>{school.name}</a><span>{school.id}</span></td>
                    <td>{school.district}</td>
                    <td>{school.address}</td>
                    <td>{school.coordinates_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>All schools have displayable coordinates.</p>}
      </section>
    </main>
  );
}
