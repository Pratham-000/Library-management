import { useState } from "react";
import { searchAI } from "../api/ai.api";
import { AISearchBar } from "../components/ai/AISearchBar";
import { AISearchResultCard } from "../components/ai/AISearchResultCard";
import { AISearchSuggestions } from "../components/ai/AISearchSuggestions";
import { PageHeader } from "../components/layout/PageHeader";
import type { AISearchResult } from "../types/ai";

export function AISearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AISearchResult[] | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await searchAI(trimmedQuery);
      setResults(response);
    } catch {
      setResults(null);
      setError(
        "AI Search could not complete your request. Make sure your notes or resources have been indexed, then try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestionSelect(suggestion: string) {
    setQuery(suggestion);
    setResults(null);
    setError("");
  }

  return (
    <section className="ai-search-page">
      <PageHeader
        title="AI Search"
        description="Ask your indexed notes and resources a question by meaning."
      />

      <AISearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {error ? (
        <div className="ai-search-page__error" role="alert">
          {error}
        </div>
      ) : null}

      {!results && !isLoading && !error ? (
        <AISearchSuggestions onSelect={handleSuggestionSelect} />
      ) : null}

      {isLoading ? (
        <div className="ai-search-page__loading">
          Searching your indexed study materials...
        </div>
      ) : null}

      {results ? (
        <section className="ai-search-results">
          <div className="ai-search-results__header">
            <h2>Search results</h2>
            <span>
              {results.length} result{results.length === 1 ? "" : "s"}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="ai-search-results__empty">
              <h3>No indexed matches found</h3>
              <p>
                Index a note or resource first, then search again using a
                related question.
              </p>
            </div>
          ) : (
            <div className="ai-search-results__list">
              {results.map((result, index) => (
                <AISearchResultCard
                  key={`${result.entityType}-${result.note?.id ?? result.resource?.id ?? index}`}
                  result={result}
                  rank={index + 1}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </section>
  );
}