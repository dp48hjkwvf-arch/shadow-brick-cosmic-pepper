import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarRange,
  Inbox,
  Search,
  Settings,
  StickyNote,
  Sunrise,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { addDays, nowTime, prettyDate, prettyShort, startOfWeek, todayISO } from "@/lib/life/dates";
import { blankSession, newId } from "@/lib/life/factory";
import {
  agendaOn,
  computeStats,
  currentFocusMs,
  proposeWeek,
  searchAll,
} from "@/lib/life/logic";
import { isIos, isStandalone, notificationsSupported } from "@/lib/life/notify";
import { normalizeImport, useLife } from "@/lib/life/store";
import type { ViewId } from "@/lib/life/types";
import type { Editor } from "./forms";
import { Btn, Card, Empty, Field, Section, fieldClass } from "./ui";

export function Extra({
  view,
  go,
  onOpen,
}: {
  view: ViewId;
  go: (view: ViewId) => void;
  onOpen: (editor: Editor) => void;
}) {
  if (view === "pendientes") return <InboxScreen onOpen={onOpen} />;
  if (view === "estudio") return <StudyScreen onOpen={onOpen} />;
  if (view === "manana") return <TomorrowScreen onOpen={onOpen} />;
  if (view === "semana") return <WeekScreen />;
  if (view === "notas") return <NotesScreen onOpen={onOpen} />;
  if (view === "stats") return <StatsScreen />;
  if (view === "ajustes") return <SettingsScreen />;
  if (view === "buscar") return <SearchScreen onOpen={onOpen} go={go} />;
  return <MoreHome go={go} />;
}

function MoreHome({ go }: { go: (view: ViewId) => void }) {
  const items: { id: ViewId; label: string; hint: string; icon: typeof Inbox }[] = [
    { id: "pendientes", label: "Pendientes", hint: "Ideas sin fecha", icon: Inbox },
    { id: "estudio", label: "Estudio", hint: "Concentración", icon: Timer },
    { id: "manana", label: "Preparar mañana", hint: "Clases y mochila", icon: Sunrise },
    { id: "semana", label: "Mi semana", hint: "Una propuesta editable", icon: CalendarRange },
    { id: "notas", label: "Notas", hint: "Apuntes sueltos", icon: StickyNote },
    { id: "stats", label: "Estadísticas", hint: "Solo lo que hiciste", icon: BarChart3 },
    { id: "buscar", label: "Buscar", hint: "En todo LifeOS", icon: Search },
    { id: "ajustes", label: "Ajustes", hint: "Avisos, copia, tema", icon: Settings },
  ];
  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Más</h1>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => go(item.id)} className="min-h-28 rounded-card border border-line bg-card p-3 text-left">
            <item.icon className="mb-3 size-5 text-sage" />
            <span className="block font-medium">{item.label}</span>
            <span className="mt-1 block text-sm text-ink-soft">{item.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function InboxScreen({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const inbox = useLife((s) => s.snap.inbox);
  const convert = useLife((s) => s.convertInbox);
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const items = inbox.filter((item) => (showArchived ? item.archived : !item.archived) && `${item.title} ${item.notes} ${item.category}`.toLocaleLowerCase("es").includes(q.trim().toLocaleLowerCase("es")));
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="font-display text-4xl leading-none">Pendientes</h1>
        <Btn variant="soft" className="min-h-10" onClick={() => onOpen({ kind: "inbox" })}>Nuevo</Btn>
      </div>
      <input className={`${fieldClass} mb-3`} placeholder="Buscar" value={q} onChange={(e) => setQ(e.target.value)} />
      <button type="button" className="mb-3 text-sm text-sage" onClick={() => setShowArchived((v) => !v)}>{showArchived ? "Ver activos" : "Ver archivados"}</button>
      {items.length === 0 ? <Empty title="Bandeja vacía" body="Guardá acá lo que todavía no tiene fecha. Después lo convertís en tarea, evento o recordatorio." /> : (
        <div className="grid gap-2">
          {items.map((item) => (
            <Card key={item.id}>
              <button type="button" className="w-full text-left" onClick={() => onOpen({ kind: "inbox", id: item.id })}>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-ink-soft">{item.category || "Sin categoría"}{item.notes ? ` · ${item.notes}` : ""}</p>
              </button>
              {!item.archived ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="text-sm text-sage" onClick={() => convert(item.id, "tarea")}>Hacer tarea</button>
                  <button type="button" className="text-sm text-sage" onClick={() => convert(item.id, "evento")}>Hacer evento</button>
                  <button type="button" className="text-sm text-sage" onClick={() => convert(item.id, "recordatorio")}>Hacer recordatorio</button>
                </div>
              ) : item.converted ? <p className="mt-1 text-sm text-ink-soft">Ya es {item.converted.kind}</p> : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StudyScreen({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const snap = useLife((s) => s.snap);
  const setFocus = useLife((s) => s.setFocus);
  const patchFocus = useLife((s) => s.patchFocus);
  const upsertSession = useLife((s) => s.upsertSession);
  const focus = snap.focus;
  const [now, setNow] = useState(() => Date.now());
  const [title, setTitle] = useState("Sesión de estudio");
  const [target, setTarget] = useState(25);
  const [taskId, setTaskId] = useState("");
  const [examId, setExamId] = useState("");
  useEffect(() => {
    if (!focus?.runningSince) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [focus?.runningSince]);
  const elapsed = focus ? currentFocusMs(focus, now) : 0;
  const start = () => {
    const session = blankSession({
      title: title.trim() || "Sesión de estudio",
      date: todayISO(),
      start: nowTime(),
      plannedMinutes: target,
      taskId: taskId || undefined,
      examId: examId || undefined,
      subjectId: snap.tasks.find((t) => t.id === taskId)?.subjectId || snap.exams.find((e) => e.id === examId)?.subjectId,
    });
    upsertSession(session);
    setFocus({
      sessionId: session.id,
      title: session.title,
      targetMinutes: target,
      accumulatedMs: 0,
      runningSince: Date.now(),
      taskId: taskId || undefined,
      examId: examId || undefined,
      subjectId: session.subjectId,
    });
  };
  const pause = () => {
    if (!focus?.runningSince) return;
    patchFocus({ accumulatedMs: currentFocusMs(focus), runningSince: null });
  };
  const finish = (cancel: boolean) => {
    if (!focus) return;
    const minutes = Math.round(currentFocusMs(focus) / 60000);
    const session = snap.sessions.find((s) => s.id === focus.sessionId);
    if (session) {
      upsertSession({
        ...session,
        focusMinutes: minutes,
        status: cancel && minutes === 0 ? "cancelada" : "completada",
      });
    }
    setFocus(null);
  };
  const history = [...snap.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.start ?? "").localeCompare(a.start ?? "")).slice(0, 8);
  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Estudio</h1>
      <Card className="mb-4 text-center">
        <p className="font-display text-6xl tabular-nums leading-none">{formatMs(elapsed)}</p>
        <p className="mt-2 text-sm text-ink-soft">{focus ? focus.title : `Meta ${target} min`}</p>
        <p className="text-sm text-ink-soft">Las pausas no suman.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {!focus ? <Btn onClick={start}>Iniciar</Btn> : focus.runningSince ? <Btn onClick={pause}>Pausar</Btn> : <Btn onClick={() => patchFocus({ runningSince: Date.now() })}>Reanudar</Btn>}
          <Btn variant="ghost" disabled={!focus} onClick={() => finish(false)}>Finalizar</Btn>
        </div>
      </Card>
      {!focus ? (
        <>
          <Field label="En qué">
            <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Minutos">
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 40, 50].map((n) => (
                <button key={n} type="button" onClick={() => setTarget(n)} className={`min-h-11 rounded-2xl tabular-nums ${target === n ? "bg-sage text-paper" : "border border-line bg-card"}`}>{n}</button>
              ))}
            </div>
          </Field>
          <Field label="Tarea">
            <select className={fieldClass} value={taskId} onChange={(e) => setTaskId(e.target.value)}>
              <option value="">Ninguna</option>
              {snap.tasks.filter((t) => t.status === "pendiente").map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </Field>
          <Field label="Examen">
            <select className={fieldClass} value={examId} onChange={(e) => setExamId(e.target.value)}>
              <option value="">Ninguno</option>
              {snap.exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </Field>
        </>
      ) : null}
      <Section title="Historial" action={<button type="button" className="text-sm text-sage" onClick={() => onOpen({ kind: "sesion" })}>Planificar</button>}>
        {history.length === 0 ? <Empty title="Todavía no hay sesiones" body="Cuando termines una, el tiempo real queda guardado." /> : history.map((session) => (
          <button key={session.id} type="button" className="flex min-h-12 w-full items-center justify-between gap-3 text-left" onClick={() => onOpen({ kind: "sesion", id: session.id })}>
            <span>
              <span className="block">{session.title}</span>
              <span className="text-sm text-ink-soft">{prettyShort(session.date)} · {session.status}</span>
            </span>
            <span className="tabular-nums text-sm">{session.focusMinutes} min</span>
          </button>
        ))}
      </Section>
    </div>
  );
}

function formatMs(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TomorrowScreen({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const snap = useLife((s) => s.snap);
  const toggle = useLife((s) => s.toggleBackpack);
  const add = useLife((s) => s.addBackpack);
  const remove = useLife((s) => s.deleteBackpack);
  const upsertTask = useLife((s) => s.upsertTask);
  const today = todayISO();
  const tomorrow = addDays(today, 1);
  const items = agendaOn(snap, tomorrow);
  const late = snap.tasks.filter((t) => t.status === "pendiente" && t.dueDate && t.dueDate < today);
  const checks = snap.backpackChecks[tomorrow] ?? [];
  const [label, setLabel] = useState("");
  return (
    <div>
      <h1 className="mb-1 font-display text-4xl leading-none">Mañana</h1>
      <p className="mb-4 text-ink-soft">{prettyDate(tomorrow)}</p>
      <Section title="Te espera">
        {items.length === 0 ? <Empty title="Mañana está libre" body="No hay clases, entregas, eventos ni rutinas." /> : items.map((item) => (
          <button key={item.key} type="button" className="flex min-h-12 w-full items-center gap-3 text-left" onClick={() => onOpen(item.source === "tarea" ? { kind: "tarea", id: item.sourceId } : item.source === "examen" ? { kind: "examen", id: item.sourceId } : item.source === "evento" ? { kind: "evento", id: item.sourceId, date: tomorrow } : item.source === "rutina" ? { kind: "rutina", id: item.sourceId } : item.source === "estudio" ? { kind: "sesion", id: item.sourceId } : { kind: "bloque", id: item.sourceId, date: tomorrow })}>
            <span className="w-12 tabular-nums text-sm text-ink-soft">{item.start ?? "—"}</span>
            <span><span className="block">{item.title}</span><span className="text-sm text-ink-soft">{item.detail}</span></span>
          </button>
        ))}
      </Section>
      {late.length ? (
        <Section title="Atrasadas">
          <p className="mb-2 text-sm text-ink-soft">No las muevo solas. Si querés, pasalas a mañana.</p>
          {late.map((task) => (
            <Card key={task.id} className="mb-2 flex items-center justify-between gap-2">
              <span>{task.title}</span>
              <button type="button" className="text-sm text-sage" onClick={() => upsertTask({ ...task, dueDate: tomorrow })}>Pasar a mañana</button>
            </Card>
          ))}
        </Section>
      ) : null}
      <Section title="Mochila">
        {snap.backpack.map((item) => {
          const on = checks.includes(item.id);
          return (
            <div key={item.id} className="flex items-center gap-2">
              <button type="button" className="flex min-h-11 flex-1 items-center gap-3 text-left" onClick={() => toggle(tomorrow, item.id)}>
                <span className={`size-4 rounded-full border ${on ? "border-sage bg-sage" : "border-line"}`} />
                <span className={on ? "text-ink-soft line-through" : ""}>{item.label}</span>
              </button>
              <button type="button" className="text-sm text-clay" onClick={() => remove(item.id)}>Quitar</button>
            </div>
          );
        })}
        <div className="mt-3 flex gap-2">
          <input className={fieldClass} value={label} placeholder="Sumar a la lista" onChange={(e) => setLabel(e.target.value)} />
          <Btn variant="soft" onClick={() => { if (!label.trim()) return; add(label); setLabel(""); }}>Sumar</Btn>
        </div>
      </Section>
    </div>
  );
}

function WeekScreen() {
  const snap = useLife((s) => s.snap);
  const accept = useLife((s) => s.acceptProposals);
  const today = todayISO();
  const week = startOfWeek(today);
  const proposals = proposeWeek(snap, week);
  const [picked, setPicked] = useState<string[]>([]);
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  return (
    <div>
      <h1 className="mb-2 font-display text-4xl leading-none">Mi semana</h1>
      <p className="mb-4 text-sm text-ink-soft">Miro entregas, clases y huecos de 16:00 a 20:30. Nada entra al calendario hasta que lo confirmes.</p>
      {days.map((date) => {
        const list = agendaOn(snap, date);
        return (
          <section key={date} className="mb-3">
            <p className="text-sm text-ink-soft">{date === today ? "Hoy" : prettyShort(date)}</p>
            {list.length === 0 ? <p className="text-sm">Libre</p> : list.map((item) => (
              <p key={item.key} className="text-sm"><span className="tabular-nums text-ink-soft">{item.start ?? "·"} </span>{item.title}</p>
            ))}
          </section>
        );
      })}
      <Section title="Organizar mi semana">
        {proposals.length === 0 ? <Empty title="No hay huecos útiles" body="O ya cubriste el tiempo estimado, o la tarde está llena." /> : proposals.map((item) => {
          const on = picked.includes(item.id);
          return (
            <button key={item.id} type="button" onClick={() => setPicked((list) => on ? list.filter((id) => id !== item.id) : [...list, item.id])} className="mb-2 w-full text-left">
              <Card className={on ? "border-sage" : ""}>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-ink-soft">{prettyShort(item.date)} · {item.start}–{item.end} · {item.reason}</p>
              </Card>
            </button>
          );
        })}
        {picked.length ? <Btn className="mt-2 w-full" onClick={() => { accept(proposals.filter((p) => picked.includes(p.id))); setPicked([]); toast.success("Sesiones agregadas. El resto del calendario no cambió."); }}>Agregar seleccionadas</Btn> : null}
      </Section>
    </div>
  );
}

function NotesScreen({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const notes = useLife((s) => s.snap.notes);
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <h1 className="font-display text-4xl leading-none">Notas</h1>
        <Btn variant="soft" className="min-h-10" onClick={() => onOpen({ kind: "nota" })}>Nueva</Btn>
      </div>
      {notes.length === 0 ? <Empty title="Sin notas" body="Sirven para fórmulas, ideas y lo que no es una tarea." /> : (
        <div className="grid gap-2">
          {notes.map((note) => (
            <button key={note.id} type="button" className="text-left" onClick={() => onOpen({ kind: "nota", id: note.id })}>
              <Card>
                <BookOpen className="mb-2 size-4 text-sage" />
                <p className="font-medium">{note.title || "Sin título"}</p>
                <p className="line-clamp-2 text-sm text-ink-soft">{note.content}</p>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsScreen() {
  const snap = useLife((s) => s.snap);
  const stats = computeStats(snap);
  const [Chart, setChart] = useState<typeof import("recharts") | null>(null);
  useEffect(() => {
    void import("recharts").then(setChart);
  }, []);
  const max = Math.max(1, ...stats.weekBars.map((b) => b.minutos));
  return (
    <div>
      <h1 className="mb-2 font-display text-4xl leading-none">Estadísticas</h1>
      <p className="mb-4 text-sm text-ink-soft">Salen de tus registros. Si no hay actividad, el número es cero.</p>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Stat n={stats.tasksDone} label="Tareas hechas" />
        <Stat n={stats.tasksOnTime} label="A tiempo" />
        <Stat n={stats.tasksLate} label="Tarde" />
        <Stat n={stats.tasksPending} label="Pendientes" />
        <Stat n={stats.tasksCancelled} label="Canceladas" />
        <Stat n={stats.examsUpcoming} label="Exámenes por venir" />
        <Stat n={stats.focusMinutes} label="Minutos de foco este mes" />
        <Stat n={stats.sessionsDone} label="Sesiones cerradas" />
        <Stat n={`${stats.habitRate}%`} label="Hábitos de la semana" />
        <Stat n={`${stats.routineRate}%`} label="Rutinas completas" />
      </div>
      <Card className="mb-3">
        <p className="mb-2 text-sm text-ink-soft">Minutos de foco, lunes a domingo</p>
        {Chart ? (
          <div className="h-36 w-full text-ink-soft">
            <Chart.ResponsiveContainer width="100%" height="100%">
              <Chart.BarChart data={stats.weekBars}>
                <Chart.XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 12 }} />
                <Chart.Bar dataKey="minutos" fill="var(--color-sage)" radius={[6, 6, 0, 0]} />
              </Chart.BarChart>
            </Chart.ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-28 items-end gap-2">
            {stats.weekBars.map((bar) => (
              <div key={bar.d} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t-lg bg-sage" style={{ height: Math.round((bar.minutos / max) * 88) }} />
                <span className="text-xs text-ink-soft">{bar.d}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
      <p className="text-sm text-ink-soft">Hábitos: {stats.habitDone} hechos, {stats.habitSkipped} omitidos, {stats.habitMissed} sin marcar en días que sí correspondían. Rutinas de esta semana: {stats.routineDone} de {stats.routineScheduled}.</p>
    </div>
  );
}

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <Card>
      <p className="font-display text-3xl tabular-nums leading-none">{n}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </Card>
  );
}

function SearchScreen({ onOpen, go }: { onOpen: (editor: Editor) => void; go: (view: ViewId) => void }) {
  const snap = useLife((s) => s.snap);
  const [q, setQ] = useState("");
  const hits = searchAll(snap, q);
  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Buscar</h1>
      <input className={fieldClass} autoFocus placeholder="Tareas, materias, notas…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-3 grid gap-2">
        {q.trim() && hits.length === 0 ? <Empty title="Nada con ese texto" body="Revisá la ortografía o probá una palabra más corta." /> : null}
        {hits.map((hit) => (
          <button key={`${hit.kind}:${hit.id}`} type="button" className="text-left" onClick={() => {
            if (hit.kind === "Tarea") onOpen({ kind: "tarea", id: hit.id });
            else if (hit.kind === "Examen") onOpen({ kind: "examen", id: hit.id });
            else if (hit.kind === "Evento") onOpen({ kind: "evento", id: hit.id });
            else if (hit.kind === "Rutina") onOpen({ kind: "rutina", id: hit.id });
            else if (hit.kind === "Hábito") onOpen({ kind: "habito", id: hit.id });
            else if (hit.kind === "Nota") onOpen({ kind: "nota", id: hit.id });
            else if (hit.kind === "Pendiente") onOpen({ kind: "inbox", id: hit.id });
            else if (hit.kind === "Estudio") onOpen({ kind: "sesion", id: hit.id });
            else { go("colegio"); onOpen({ kind: "materia", id: hit.id }); }
          }}>
            <Card>
              <p className="text-xs text-ink-soft">{hit.kind}</p>
              <p className="font-medium">{hit.title}</p>
              <p className="text-sm text-ink-soft">{hit.subtitle}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen() {
  const snap = useLife((s) => s.snap);
  const setPrefs = useLife((s) => s.setPrefs);
  const emptyAll = useLife((s) => s.emptyAll);
  const loadSample = useLife((s) => s.loadSample);
  const importSnap = useLife((s) => s.importSnap);
  const dismiss = useLife((s) => s.dismissNotice);
  const [perm, setPerm] = useState<string>("");
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [confirm, setConfirm] = useState<"vacio" | "ejemplo" | null>(null);
  useEffect(() => {
    setStandalone(isStandalone());
    setIos(isIos());
    setPerm(notificationsSupported() ? Notification.permission : "unsupported");
  }, [snap.notices.length]);
  const enable = async () => {
    if (!notificationsSupported()) {
      toast.error("Este navegador no ofrece avisos.");
      return;
    }
    if (isIos() && !isStandalone()) {
      toast("En el iPhone, primero agregá LifeOS a la pantalla de inicio.");
      return;
    }
    const result = await Notification.requestPermission();
    setPerm(result);
    if (result === "granted") toast.success("Listo. Los avisos locales pueden mostrarse con la app abierta.");
    if (result === "denied") toast("El permiso quedó bloqueado. Habilitalo en Ajustes del iPhone.");
  };
  const test = async () => {
    if (Notification.permission !== "granted") return;
    const { showLocalNotice } = await import("@/lib/life/notify");
    await showLocalNotice("LifeOS", "Este es un aviso de prueba en el dispositivo.", "hoy", `test-${newId()}`);
  };
  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Ajustes</h1>
      <Section title="Tema">
        <div className="grid grid-cols-3 gap-2">
          {(["sistema", "claro", "oscuro"] as const).map((theme) => (
            <button key={theme} type="button" onClick={() => setPrefs({ theme })} className={`min-h-11 rounded-2xl capitalize ${snap.prefs.theme === theme ? "bg-sage text-paper" : "border border-line bg-card"}`}>{theme}</button>
          ))}
        </div>
      </Section>
      <Field label="Cómo te llamo">
        <input className={fieldClass} value={snap.prefs.displayName} placeholder="Opcional" onChange={(e) => setPrefs({ displayName: e.target.value })} />
      </Field>
      <Field label="Aviso nocturno para preparar mañana">
        <input className={fieldClass} type="time" value={snap.prefs.nightReminder ?? ""} onChange={(e) => setPrefs({ nightReminder: e.target.value || null })} />
      </Field>
      <Section title="Avisos">
        <p className="mb-2 text-sm text-ink-soft">
          {standalone ? "LifeOS está abierta como app, sin la barra de Safari." : "Estás en el navegador. En el iPhone, los avisos web piden la app en la pantalla de inicio."}
          {ios ? " Detecté un iPhone o iPad." : ""}
        </p>
        <p className="mb-3 text-sm">
          Estado del permiso: {perm === "granted" ? "concedido" : perm === "denied" ? "bloqueado" : perm === "unsupported" ? "no disponible" : "todavía no pedido"}.
        </p>
        <div className="grid gap-2">
          <Btn onClick={() => void enable()}>Activar notificaciones</Btn>
          <Btn variant="soft" onClick={() => void test()} disabled={perm !== "granted"}>Probar aviso local</Btn>
        </div>
        {perm === "denied" ? <p className="mt-2 text-sm text-ink-soft">En el iPhone: Ajustes, Notificaciones, LifeOS. Si no aparece, la app no está instalada o el sistema no ofrece avisos web.</p> : null}
        {!standalone ? (
          <Card className="mt-3">
            <p className="font-medium">Instalar en el iPhone</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
              <li>Abrí LifeOS en Safari.</li>
              <li>Tocá Compartir.</li>
              <li>Elegí Agregar a inicio.</li>
              <li>Abrila desde el ícono, no desde una pestaña.</li>
            </ol>
          </Card>
        ) : null}
        <div className="mt-3 grid gap-2">
          {snap.notices.map((notice) => (
            <button key={notice.id} type="button" className="text-left" onClick={() => dismiss(notice.id)}>
              <Card>
                <p className="font-medium">{notice.title}</p>
                <p className="text-sm">{notice.body}</p>
                <p className="text-xs text-ink-soft">Tocá para descartar</p>
              </Card>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Tus datos">
        <p className="mb-3 text-sm text-ink-soft">Viven en este teléfono, en IndexedDB. No hay cuenta obligatoria. Exportá una copia si vas a borrar Safari.</p>
        <div className="grid gap-2">
          <Btn variant="soft" onClick={() => download(snap)}>Exportar copia</Btn>
          <label className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-card px-4 text-sage">
            Importar copia
            <input type="file" accept="application/json" className="sr-only" onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              try {
                importSnap(normalizeImport(JSON.parse(await file.text())));
                toast.success("Copia restaurada en este teléfono.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "No se pudo importar.");
              }
            }} />
          </label>
          <Btn variant="ghost" onClick={() => setConfirm("ejemplo")}>Cargar datos de ejemplo</Btn>
          <Btn variant="ghost" onClick={() => setConfirm("vacio")}>Vaciar todo</Btn>
        </div>
        {confirm ? (
          <Card className="mt-3">
            <p className="mb-2">{confirm === "vacio" ? "Se borra todo lo guardado en este teléfono." : "Se reemplaza lo actual por el ejemplo."}</p>
            <div className="grid grid-cols-2 gap-2">
              <Btn variant="clay" onClick={() => { if (confirm === "vacio") emptyAll(); else loadSample(); setConfirm(null); }}>Confirmar</Btn>
              <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancelar</Btn>
            </div>
          </Card>
        ) : null}
      </Section>
      <Section title="Qué puede y qué no">
        <ul className="grid gap-2 text-sm text-ink-soft">
          <li>Los datos persisten en el dispositivo aunque cierres la app.</li>
          <li>Sin internet podés seguir viendo y editando lo ya cargado si la app llegó a abrirse publicada al menos una vez.</li>
          <li>Un aviso con la app abierta no es lo mismo que una notificación push de un servidor, ni que una alarma de Reloj.</li>
          <li>No hay servidor de push conectado: nadie puede enviarte un aviso con la pantalla bloqueada desde LifeOS.</li>
          <li>En iOS 16.4 o posterior, el push web solo existe para PWAs instaladas, con permiso, y con un servidor. Acá falta ese servidor a propósito, para no guardar tus suscripciones en un sitio público.</li>
          <li>Si cambiás una fecha, el aviso pendiente se recalcula. Si completás o borrás, no se vuelve a disparar.</li>
          <li>Una actualización publicada se aplica con el botón de la app, sin reinstalar el ícono.</li>
        </ul>
      </Section>
    </div>
  );
}

function download(snap: unknown) {
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `lifeos-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
