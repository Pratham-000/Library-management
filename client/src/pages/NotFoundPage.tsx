import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-page__card">
        <p>404</p>
        <h1>Page not found</h1>
        <span>The page you requested does not exist.</span>
        <Link to="/">Return to dashboard</Link>
      </section>
    </main>
  );
}