import { NAV_SERVICES } from "../../../data/site";
import { getCalendarPage } from "../../content";
import type { CalendarServiceOption } from "./types";

export async function loadCalendarServices(): Promise<CalendarServiceOption[]> {
  const [spanish, english] = await Promise.all([
    getCalendarPage("es").catch(() => null),
    getCalendarPage("en").catch(() => null),
  ]);
  const merged = [...(spanish?.services ?? []), ...(english?.services ?? [])];
  const unique = new Map<string, CalendarServiceOption>();
  for (const item of merged) {
    if (!item.id || !item.label) continue;
    unique.set(`${item.id}\n${item.label}`, item);
  }
  if (unique.size > 0) return [...unique.values()];
  return NAV_SERVICES.map((service) => ({
    id: service.slug,
    label: service.nombre,
    ...(service.slug.includes("web") ? { asksForWebsite: true } : {}),
  }));
}
