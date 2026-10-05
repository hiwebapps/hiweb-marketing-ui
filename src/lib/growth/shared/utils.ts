export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function navigateToUrl(url: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }

  window.location.href = trimmed;
}
