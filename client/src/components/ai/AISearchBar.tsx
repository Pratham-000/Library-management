import { Search } from "lucide-react";

type AISearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function AISearchBar({
  value,
  onChange,
  onSubmit,
  isLoading,
}: AISearchBarProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="ai-search-bar" onSubmit={handleSubmit}>
      <Search
        className="ai-search-bar__icon"
        size={21}
        aria-hidden="true"
      />

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask about your notes or resources..."
        disabled={isLoading}
        aria-label="Ask AI Search a question"
      />

      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="ai-search-bar__submit"
      >
        {isLoading ? "Searching..." : "Ask AI"}
      </button>
    </form>
  );
}