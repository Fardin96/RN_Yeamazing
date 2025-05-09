// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// Simplified time formatter using explicit parts
export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format as HH:MM (24-hour)
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}
