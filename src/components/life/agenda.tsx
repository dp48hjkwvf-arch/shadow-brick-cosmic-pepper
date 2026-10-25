import { useMemo, useState } from "react";
import { addDays, daysInMonth, dow, prettyDate, prettyShort, startOfMonth, startOfWeek, todayISO } from "@/lib/life/dates";
import { agendaOn, conflictsOn } from "@/lib/life/logic";
import { useLife } from "@/lib/life/store";
import type { AgendaItem } from "@/lib/life/types";
import type { Editor } from "./forms";
import { Btn, Card, Empty, Section, Segmented } from "./ui";

export function Agenda({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const snap = useLife((s) => s.snap);
  const skip = useLife((s) => s.skipEventOn);
  const removeEvent = useLife((s) => s.deleteEvent);
  const [mode, setMode] = useState<"mes" | "semana" | "dia">("mes");
  const [cursor, setCursor] = useState(todayISO());
  const [query, setQuery] = useState("");
  const today = todayISO();
  const monthStart = startOfMonth(cursor);
  const gridStart = startOfWeek(monthStart);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekStart = startOfWeek(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayItems = agendaOn(snap, cursor);
  const clashes = conflictsOn(dayItems);
  const filtered = query.trim()
    ? snap.events.filter((ev) => `${ev.title} ${ev.description} ${ev.category}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")))
    : [];

  const openItem = (item: AgendaItem) => {
    if (item.source === "clase") onOpen({ kind: "bloque", id: item.sourceId, date: item.date });
    else if (item.source === "tarea") onOpen({ kind: "tarea", id: item.sourceId });
    else if (item.source === "examen") onOpen({ kind: "examen", id: item.sourceId });
    else if (item.source === "rutina") onOpen({ kind: "rutina", id: item.sourceId });
    else if (item.source === "estudio") onOpen({ kind: "sesion", id: item.sourceId });
    else onOpen({ kind: "evento", id: item.sourceId, date: item.date, scope: "serie" });
  };

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const date of cells) map.set(date, agendaOn(snap, date).length);
    return map;
  }, [snap, cells]);

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <h1 className="font-display text-4xl leading-none">Agenda</h1>
        <Btn variant="soft" className="min-h-10" onClick={() => onOpen({ kind: "evento", date: cursor })}>Nuevo</Btn>
      </div>
      <input className="mb-3 min-h-12 w-full rounded-2xl border border-line bg-card px-3 text-base" placeholder="Buscar eventos" value={query} onChange={(e) => setQuery(e.target.value)} />
      {query.trim() ? (
        <div className="mb-4 grid gap-2">
          {filtered.length === 0 ? <Empty title="Sin resultados" body="Probá con otro nombre o categoría." /> : filtered.map((ev) => (
            <button key={ev.id} type="button" className="text-left" onClick={() => onOpen({ kind: "evento", id: ev.id })}>
              <Card><p className="font-medium">{ev.title}</p><p className="text-sm text-ink-soft">{prettyShort(ev.date)} · {ev.category}</p></Card>
            </button>
          ))}
        </div>
      ) : null}
      <Segmented value={mode} onChange={setMode} options={[{ id: "mes", label: "Mes" }, { id: "semana", label: "Semana" }, { id: "dia", label: "Día" }]} />
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className="grid size-11 place-items-center rounded-full border border-line" aria-label="Anterior" onClick={() => setCursor(addDays(cursor, mode === "mes" ? -30 : mode === "semana" ? -7 : -1))}>‹</button>
        <p className="font-medium">{mode === "dia" ? prettyDate(cursor) : prettyShort(mode === "semana" ? weekStart : monthStart)}</p>
        <button type="button" className="grid size-11 place-items-center rounded-full border border-line" aria-label="Siguiente" onClick={() => setCursor(addDays(cursor, mode === "mes" ? 30 : mode === "semana" ? 7 : 1))}>›</button>
      </div>
      {mode === "mes" ? (
        <>
          <div className="mb-1 grid grid-cols-7 text-center text-xs text-ink-soft">
            {["L", "M", "X", "J", "V", "S", "D"].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="mb-4 grid grid-cols-7 gap-1">
            {cells.map((date) => {
              const inMonth = date.slice(0, 7) === monthStart.slice(0, 7);
              const selected = date === cursor;
              const n = counts.get(date) ?? 0;
              return (
                <button key={date} type="button" onClick={() => { setCursor(date); setMode("dia"); }} className={`flex min-h-12 flex-col items-center justify-center rounded-xl text-sm tabular-nums ${selected ? "bg-sage text-paper" : "bg-card"} ${inMonth ? "" : "opacity-40"}`}>
                  {Number(date.slice(8))}
                  {n > 0 ? <span className={`mt-0.5 size-1.5 rounded-full ${selected ? "bg-paper" : "bg-clay"}`} /> : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
      {mode === "semana" ? (
        <div className="mb-4 grid gap-3">
          {weekDays.map((date) => {
            const list = agendaOn(snap, date);
            return (
              <section key={date}>
                <button type="button" className="mb-1 text-sm text-ink-soft" onClick={() => { setCursor(date); setMode("dia"); }}>
                  {date === today ? "Hoy" : prettyDate(date)} · {list.length}
                </button>
                {list.slice(0, 3).map((item) => (
                  <button key={item.key} type="button" className="flex min-h-11 w-full items-center gap-2 text-left" onClick={() => openItem(item)}>
                    <span className="w-12 tabular-nums text-sm text-ink-soft">{item.start ?? "—"}</span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </section>
            );
          })}
        </div>
      ) : null}
      {mode !== "semana" ? (
        <Section title="En este día">
          {dayItems.length === 0 ? <Empty title="Nada en esta fecha" body="Las clases, entregas, exámenes, rutinas y sesiones aparecen acá sin duplicarse." /> : (
            <div className="grid gap-2">
              {dayItems.map((item) => {
                const clash = clashes.get(item.key);
                const event = item.source === "evento" ? snap.events.find((e) => e.id === item.sourceId) : undefined;
                return (
                  <Card key={item.key}>
                    <button type="button" className="w-full text-left" onClick={() => openItem(item)}>
                      <p className="text-xs uppercase tracking-wide text-ink-soft">{item.source}{item.start ? ` · ${item.start}` : ""}{item.end ? `–${item.end}` : ""}</p>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-ink-soft">{item.detail}</p>
                      {clash?.length ? <p className="mt-1 text-sm text-clay">Se cruza con {clash.join(", ")}</p> : null}
                    </button>
                    {event?.recurrence ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button type="button" className="text-sm text-sage" onClick={() => onOpen({ kind: "evento", id: event.id, date: item.date, scope: "dia" })}>Solo este día</button>
                        <button type="button" className="text-sm text-sage" onClick={() => onOpen({ kind: "evento", id: event.id, scope: "serie" })}>Toda la serie</button>
                        <button type="button" className="text-sm text-clay" onClick={() => skip(event.id, item.date)}>Quitar este día</button>
                        <button type="button" className="text-sm text-clay" onClick={() => removeEvent(event.id)}>Borrar serie</button>
                      </div>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          )}
        </Section>
      ) : null}
      <p className="text-xs text-ink-soft">Mes de {daysInMonth(monthStart)} días. Semana desde el lunes.</p>
      <span className="sr-only">{dow(cursor)}</span>
    </div>
  );
}
