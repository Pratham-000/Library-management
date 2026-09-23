import { Sparkles } from "lucide-react";

type AISearchSuggestionsProps = {
  onSelect: (suggestion: string) => void;
};

const suggestions = [
  "What have I saved about clean code?",
  "Find my notes about software engineering.",
  "Show resources related to English.",
  "What are the main ideas in my study notes?",
];

export function AISearchSuggestions({
  onSelect,
}: AISearchSuggestionsProps) {
  return (
    <section className="ai-search-suggestions">
      <div className="ai-search-suggestions__heading">
        <Sparkles size={19} />
        <h2>Try asking</h2>
      </div>

      <p className="ai-search-suggestions__description">
        Search uses the materials you have indexed with AI.
      </p>

      <div className="ai-search-suggestions__list">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="ai-search-suggestions__item"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}