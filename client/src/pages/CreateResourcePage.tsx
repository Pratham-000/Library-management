import { useNavigate } from "react-router-dom";
import { ResourceForm } from "../components/resources/ResourceForm";

export function CreateResourcePage() {
  const navigate = useNavigate();

  return (
    <section className="create-resource-page">
      <header className="page-header">
        <div>
          <p className="create-resource-page__eyebrow">
            Your library
          </p>

          <h2>Create Resource</h2>

          <p className="page-header__description">
            Add a book, PDF, link, or other study material.
          </p>
        </div>
      </header>

      <div className="create-resource-card">
        <ResourceForm
          onSuccess={() => {
            navigate("/resources");
          }}
          onCancel={() => {
            navigate("/resources");
          }}
        />
      </div>
    </section>
  );
}