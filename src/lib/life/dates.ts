import { format } from "date-fns";
import { es } from "date-fns/locale";

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDay(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

export function addDays(iso: string, n: number): string {
  const d = parseDay(iso);
  d.setDate(d.getDate() + n);
  return todayISO(d);
}

export function diffDays(a: string, b: string): number {
  return Math.round((parseDay(a).getTime() - parseDay(b).getTime()) / 86400000);
}

export function dow(iso: string): number {
  return parseDay(iso).getDay();
}

export function startOfWeek(iso: string): string {
  const day = dow(iso);
  const delta = day === 0 ? -6 : 1 - day;
  return addDays(iso, delta);
}

export function startOfMonth(iso: string): string {
  const d = parseDay(iso);
  return todayISO(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function daysInMonth(iso: string): number {
  const d = parseDay(iso);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function nowTime(d = new Date()): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function combine(date: string, time = "08:00"): Date {
  const d = parseDay(date);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

export function overlaps(a0: number, a1: number, b0: number, b1: number): boolean {
  return a0 < b1 && b0 < a1;
}

export function cap(s: string): string {
  if (!s) return s;
  return s.charAt(0).toLocaleUpperCase("es") + s.slice(1);
}

export function prettyDate(iso: string): string {
  return cap(format(parseDay(iso), "EEEE d 'de' MMMM", { locale: es }));
}

export function prettyShort(iso: string): string {
  return format(parseDay(iso), "d MMM", { locale: es });
}

export function monthLabel(iso: string): string {
  return cap(format(parseDay(iso), "MMMM yyyy", { locale: es }));
}

export const WEEKDAY_SHORT = ["D", "L", "M", "X", "J", "V", "S"];
export const WEEKDAY_NAME = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export function isoWeekKey(iso: string): string {
  return startOfWeek(iso);
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}
