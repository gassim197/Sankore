export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
