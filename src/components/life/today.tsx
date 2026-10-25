import { Bell, Search } from "lucide-react";
import { addDays, prettyDate, prettyShort, todayISO } from "@/lib/life/dates";
import {
  agendaOn,
  dayProgress,
  habitMark,
  isDailyScheduled,
  nextClass,
  periodCount,
  priorities,
  subjectName,
} from "@/lib/life/logic";
import { useLife } from "@/lib/life/store";
import type { ViewId } from "@/lib/life/types";
import type { Editor } from "./forms";
import { Card, CheckButton, Empty, Section, toneClass } from "./ui";

export function Today({
  onOpen,
  go,
}: {
  onOpen: (editor: Editor) => void;
  go: (view: ViewId) => void;
}) {
  const snap = useLife((s) => s.snap);
  const setStatus = useLife((s) => s.setTaskStatus);
  const markHabit = useLife((s) => s.markHabit);
  const toggleStep = useLife((s) => s.toggleStep);
  const setPrefs = useLife((s) => s.setPrefs);
  const today = todayISO();
  const progress = dayProgress(snap, today);
  const tops = priorities(snap, today);
  const upcoming = nextClass(snap);
  const items = agendaOn(snap, today).filter((item) => item.source !== "tarea");
  const due = snap.tasks.filter(
    (t) => t.status === "pendiente" && t.dueDate && (t.dueDate <= today) && !tops.some((p) => p.kind === "tarea" && p.id === t.id),
  );
  const habits = snap.habits.filter((h) => h.freq.kind !== "daily" || isDailyScheduled(h, today));
  const routines = snap.routines.filter((r) => !r.paused && r.days.includes(new Date().getDay()));
  const name = snap.prefs.displayName.trim();
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div>
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-soft">{name ? `Hola, ${name}` : "LifeOS"}</p>
          <h1 className="font-display text-4xl leading-none">{prettyDate(today)}</h1>
        </div>
        <div className="flex">
          <button type="button" className="grid size-11 place-items-center" aria-label="Buscar" onClick={() => go("buscar")}>
            <Search className="size-5" />
          </button>
          <button type="button" className="relative grid size-11 place-items-center" aria-label="Avisos" onClick={() => go("ajustes")}>
            <Bell className="size-5" />
            {snap.notices.length ? <span className="absolute right-2 top-2 size-2 rounded-full bg-clay" /> : null}
          </button>
        </div>
      </header>

      <Card className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-sm text-ink-soft">Progreso de hoy</p>
          <p className="tabular-nums text-sm">{progress.total ? `${progress.done} de ${progress.total}` : "Nada obligatorio"}</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      {snap.prefs.sample ? (
        <Card className="mb-6">
          <p className="font-medium">Datos de ejemplo</p>
          <p className="mt-1 text-sm text-ink-soft">Podés editarlos o vaciarlos cuando quieras empezar con lo tuyo.</p>
          <button type="button" className="mt-2 text-sm text-sage" onClick={() => setPrefs({ sample: false })}>Entendido, dejarlos</button>
        </Card>
      ) : null}

      <Section title="Hacé esto primero">
        <p className="mb-2 text-sm text-ink-soft">Tres sugerencias. No muevo nada si no me lo pedís.</p>
        {tops.length === 0 ? (
          <Empty title="No hay urgencias" body="Cuando cargues una tarea o un examen, van a aparecer acá." />
        ) : (
          <div className="grid gap-2">
            {tops.map((item, index) => (
              <Card key={item.key} className="flex items-center gap-2">
                {item.kind === "tarea" ? (
                  <CheckButton done={false} label={`Completar ${item.title}`} onClick={() => setStatus(item.id, "hecha")} />
                ) : (
                  <span className="grid size-11 place-items-center font-display text-xl text-sage">{index + 1}</span>
                )}
                <button type="button" className="min-h-11 flex-1 text-left" onClick={() => onOpen(item.kind === "tarea" ? { kind: "tarea", id: item.id } : { kind: "examen", id: item.id })}>
                  <span className="block font-medium">{item.title}</span>
                  <span className="block text-sm text-ink-soft">{item.reason}</span>
                </button>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section title={upcoming?.live ? "Estás en clase" : "Próxima clase"}>
        {upcoming ? (
          <button type="button" className="w-full text-left" onClick={() => onOpen({ kind: "bloque", id: upcoming.block.id, date: upcoming.date })}>
            <Card>
              <p className={`mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(upcoming.subject?.tone ?? "ink")}`}>
                {upcoming.date === today ? "Hoy" : prettyShort(upcoming.date)}
              </p>
              <p className="font-display text-3xl leading-none">{upcoming.subject?.name ?? "Clase"}</p>
              <p className="mt-2 text-sm text-ink-soft">
                {upcoming.block.start}–{upcoming.block.end}
                {upcoming.block.room || upcoming.subject?.room ? ` · ${upcoming.block.room || upcoming.subject?.room}` : ""}
                {upcoming.subject?.teacher ? ` · ${upcoming.subject.teacher}` : ""}
              </p>
            </Card>
          </button>
        ) : (
          <Empty title="Sin clases a la vista" body="Cargá materias y horarios en Colegio." action={<button type="button" className="text-sm text-sage" onClick={() => go("colegio")}>Ir a Colegio</button>} />
        )}
      </Section>

      <Section title="Hoy">
        {items.length === 0 ? (
          <Empty title="Día despejado" body="No hay clases, eventos ni rutinas para hoy." />
        ) : (
          <ol className="grid gap-2">
            {items.map((item) => (
              <li key={item.key}>
                <Card className="flex gap-3">
                  <p className="w-12 shrink-0 tabular-nums text-sm text-ink-soft">{item.start ?? "—"}</p>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-ink-soft">{item.detail}</p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        )}
      </Section>

      {due.length ? (
        <Section title="También pendiente">
          <div className="grid gap-2">
            {due.map((task) => (
              <Card key={task.id} className="flex items-center gap-2">
                <CheckButton done={false} label={`Completar ${task.title}`} onClick={() => setStatus(task.id, "hecha")} />
                <button type="button" className="min-h-11 flex-1 text-left" onClick={() => onOpen({ kind: "tarea", id: task.id })}>
                  <span className="block font-medium">{task.title}</span>
                  <span className="block text-sm text-ink-soft">{task.dueDate && task.dueDate < today ? "Vencida" : "Para hoy"}{task.subjectId ? ` · ${subjectName(snap, task.subjectId)}` : ""}</span>
                </button>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Hábitos" action={<button type="button" className="text-sm text-sage" onClick={() => go("vida")}>Ver todos</button>}>
        {habits.length === 0 ? (
          <Empty title="Sin hábitos para hoy" body="Los de días que no elegiste no aparecen, y no cuentan como fallo." />
        ) : (
          <div className="grid gap-2">
            {habits.map((habit) => {
              const mark = habitMark(snap.habitLogs, habit.id, today);
              const count = periodCount(habit, snap.habitLogs, today);
              return (
                <Card key={habit.id} className="flex items-center gap-2">
                  <CheckButton
                    done={mark === "hecho"}
                    label={mark === "hecho" ? `Desmarcar ${habit.title}` : `Completar ${habit.title}`}
                    onClick={() => markHabit(habit.id, today, mark === "hecho" ? null : "hecho")}
                  />
                  <button type="button" className="min-h-11 flex-1 text-left" onClick={() => onOpen({ kind: "habito", id: habit.id })}>
                    <span className="block font-medium">{habit.title}</span>
                    <span className="block text-sm text-ink-soft">
                      {habit.freq.kind === "daily" ? (mark === "omitido" ? "Omitido" : mark === "na" ? "No aplica" : "Hoy") : `${count.done} de ${count.target} esta ${habit.freq.kind === "weekly" ? "semana" : "mes"}`}
                    </span>
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      {routines.map((routine) => {
        const log = snap.routineLogs.find((l) => l.routineId === routine.id && l.date === today);
        return (
          <Section key={routine.id} title={routine.title} action={<button type="button" className="text-sm text-sage" onClick={() => onOpen({ kind: "rutina", id: routine.id })}>Editar</button>}>
            <p className="mb-2 text-sm text-ink-soft">{routine.time} · {routine.durationMin} min</p>
            <div className="grid gap-1">
              {routine.steps.map((step) => {
                const done = log?.doneSteps.includes(step.id) ?? false;
                return (
                  <button key={step.id} type="button" className="flex min-h-11 items-center gap-3 text-left" onClick={() => toggleStep(routine.id, today, step.id)}>
                    <span className={`size-4 rounded-full border ${done ? "border-sage bg-sage" : "border-line"}`} />
                    <span className={done ? "text-ink-soft line-through" : ""}>{step.title}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        );
      })}

      <button type="button" className="mb-2 w-full text-left" onClick={() => go("manana")}>
        <Card>
          <p className="text-sm text-ink-soft">Preparar mañana</p>
          <p className="font-medium">{prettyShort(addDays(today, 1))}</p>
        </Card>
      </button>
    </div>
  );
}
