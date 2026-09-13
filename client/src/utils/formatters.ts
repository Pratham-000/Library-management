import type { StudySessionStatus } from "../types/session";

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDurationMinutes(
  minutes: number | null | undefined,
): string {
  if (minutes === null || minutes === undefined) {
    return "—";
  }

  if (minutes < 1) {
    return "<1m";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function getStatusColor(status: StudySessionStatus): string {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";

    case "COMPLETED":
      return "bg-blue-100 text-blue-800";

    case "CANCELLED":
      return "bg-gray-100 text-gray-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
}
export function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}