import {
  addDays,
  combine,
  diffDays,
  dow,
  isoWeekKey,
  minToTime,
  monthKey,
  nowTime,
  overlaps,
  prettyShort,
  startOfWeek,
  timeToMin,
  todayISO,
} from "./dates";
import type {
  AgendaItem,
  Block,
  CalEvent,
  EventException,
  Habit,
  HabitLog,
  PriorityItem,
  Proposal,
  Routine,
  RoutineLog,
  SearchHit,
  Snapshot,
  Subject,
  Task,
  Urgency,
} from "./types";

export function subjectById(snap: Snapshot, id?: string): Subject | undefined {
  if (!id) return undefined;
  return snap.subjects.find((s) => s.id === id);
}

export function subjectName(snap: Snapshot, id?: string): string {
  return subjectById(snap, id)?.name ?? "";
}

export function classesOn(blocks: Block[], date: string): Block[] {
  const day = dow(date);
  const once = blocks.filter((b) => b.scope === "once" && b.date === date);
  const cancelled = new Set(once.map((b) => b.cancelOf).filter(Boolean) as string[]);
  const replaced = new Set(once.map((b) => b.replacesId).filter(Boolean) as string[]);
  const regulars = blocks.filter(
    (b) => b.scope === "regular" && b.dayOfWeek === day && !cancelled.has(b.id) && !replaced.has(b.id),
  );
  return [...regulars, ...once.filter((b) => !b.cancelOf)].sort((a, b) => a.start.localeCompare(b.start));
}

export function eventOccursOn(ev: CalEvent, date: string): boolean {
  if (ev.exceptions.some((e) => e.date === date && e.type === "skip")) return false;
  if (!ev.recurrence) return ev.date === date;
  const rec = ev.recurrence;
  if (date < ev.date) return false;
  if (rec.until && date > rec.until) return false;
  const interval = Math.max(1, rec.interval || 1);
  if (rec.freq === "daily") return diffDays(date, ev.date) % interval === 0;
  if (rec.freq === "weekly") {
    const days = rec.days.length ? rec.days : [dow(ev.date)];
    if (!days.includes(dow(date))) return false;
    const weeks = Math.round(diffDays(startOfWeek(date), startOfWeek(ev.date)) / 7);
    return weeks >= 0 && weeks % interval === 0;
  }
  const start = ev.date;
  if (date.slice(8, 10) !== start.slice(8, 10)) return false;
  const months =
    (Number(date.slice(0, 4)) - Number(start.slice(0, 4))) * 12 +
    (Number(date.slice(5, 7)) - Number(start.slice(5, 7)));
  return months >= 0 && months % interval === 0;
}

export function eventView(ev: CalEvent, date: string) {
  const hit = ev.exceptions.find((e) => e.date === date && e.type === "override") as
    | Extract<EventException, { type: "override" }>
    | undefined;
  return {
    title: hit?.title || ev.title,
    time: hit?.time ?? ev.time,
    endTime: hit?.endTime ?? ev.endTime,
    description: hit?.description ?? ev.description,
    category: hit?.category || ev.category,
    importance: hit?.importance || ev.importance,
  };
}

function endFrom(start: string | undefined, minutes: number): string | undefined {
  if (!start) return undefined;
  return minToTime(timeToMin(start) + minutes);
}

export function agendaOn(snap: Snapshot, date: string): AgendaItem[] {
  const items: AgendaItem[] = [];
  for (const block of classesOn(snap.blocks, date)) {
    const subject = subjectById(snap, block.subjectId);
    items.push({
      key: `clase:${block.id}:${date}`,
      source: "clase",
      sourceId: block.id,
      date,
      start: block.start,
      end: block.end,
      title: subject?.name ?? "Clase",
      detail: [block.room || subject?.room, subject?.teacher].filter(Boolean).join(" · "),
      tone: subject?.tone ?? "ink",
    });
  }
  for (const task of snap.tasks) {
    if (task.status === "cancelada" || task.dueDate !== date) continue;
    items.push({
      key: `tarea:${task.id}`,
      source: "tarea",
      sourceId: task.id,
      date,
      start: task.dueTime,
      end: task.dueTime ? endFrom(task.dueTime, 15) : undefined,
      title: task.title,
      detail: task.status === "hecha" ? "Entregada" : "Entrega",
      tone: subjectById(snap, task.subjectId)?.tone ?? "clay",
      importance: task.importance,
    });
  }
  for (const exam of snap.exams) {
    if (exam.date !== date) continue;
    items.push({
      key: `examen:${exam.id}`,
      source: "examen",
      sourceId: exam.id,
      date,
      start: exam.time,
      end: exam.time ? endFrom(exam.time, 80) : undefined,
      title: exam.title,
      detail: subjectName(snap, exam.subjectId) || "Examen",
      tone: subjectById(snap, exam.subjectId)?.tone ?? "clay",
      importance: "alta",
    });
  }
  for (const ev of snap.events) {
    if (!eventOccursOn(ev, date)) continue;
    const view = eventView(ev, date);
    items.push({
      key: `evento:${ev.id}:${date}`,
      source: "evento",
      sourceId: ev.id,
      date,
      start: view.time,
      end: view.endTime || (view.time ? endFrom(view.time, 60) : undefined),
      title: view.title,
      detail: view.category,
      tone: "ink",
      importance: view.importance,
    });
  }
  for (const routine of snap.routines) {
    if (routine.paused || !routine.days.includes(dow(date))) continue;
    items.push({
      key: `rutina:${routine.id}:${date}`,
      source: "rutina",
      sourceId: routine.id,
      date,
      start: routine.time,
      end: endFrom(routine.time, routine.durationMin || 20),
      title: routine.title,
      detail: "Rutina",
      tone: "sage",
    });
  }
  for (const session of snap.sessions) {
    if (session.date !== date || session.status === "cancelada") continue;
    items.push({
      key: `estudio:${session.id}`,
      source: "estudio",
      sourceId: session.id,
      date,
      start: session.start,
      end: session.start ? endFrom(session.start, session.plannedMinutes || 30) : undefined,
      title: session.title,
      detail: session.status === "completada" ? "Estudio hecho" : "Sesión de estudio",
      tone: "sage",
    });
  }
  return items.sort((a, b) => (a.start ?? "99:99").localeCompare(b.start ?? "99:99") || a.title.localeCompare(b.title));
}

export function conflictsOn(items: AgendaItem[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const timed = items.filter((i) => i.start && i.end && i.source !== "tarea");
  for (let i = 0; i < timed.length; i++) {
    for (let j = i + 1; j < timed.length; j++) {
      const a = timed[i];
      const b = timed[j];
      if (!a || !b || !a.start || !a.end || !b.start || !b.end) continue;
      if (!overlaps(timeToMin(a.start), timeToMin(a.end), timeToMin(b.start), timeToMin(b.end))) continue;
      map.set(a.key, [...(map.get(a.key) ?? []), b.title]);
      map.set(b.key, [...(map.get(b.key) ?? []), a.title]);
    }
  }
  return map;
}

export function urgencyOf(task: Task, today: string): Urgency {
  if (task.urgencyMode !== "auto") return task.urgencyMode;
  if (!task.dueDate) return "sin-apuro";
  const d = diffDays(task.dueDate, today);
  if (d < 0) return "vencida";
  if (d === 0) return "hoy";
  if (d <= 3) return "proxima";
  return "sin-apuro";
}

const URGENCY_SCORE: Record<Urgency, number> = {
  vencida: 6,
  hoy: 5,
  proxima: 3,
  "sin-apuro": 0.6,
};
const IMPORTANCE_SCORE = { baja: 1, media: 2, alta: 4 };

export function priorities(snap: Snapshot, today = todayISO()): PriorityItem[] {
  const items: PriorityItem[] = [];
  for (const task of snap.tasks) {
    if (task.status !== "pendiente") continue;
    const urg = urgencyOf(task, today);
    const score =
      (task.pinned ? 20 : 0) + IMPORTANCE_SCORE[task.importance] * 2 + URGENCY_SCORE[urg];
    const when = !task.dueDate
      ? "Sin fecha"
      : urg === "vencida"
        ? "Vencida"
        : urg === "hoy"
          ? "Para hoy"
          : `Para el ${prettyShort(task.dueDate)}`;
    items.push({
      key: `tarea:${task.id}`,
      kind: "tarea",
      id: task.id,
      title: task.title,
      reason: `${when} · ${task.importance}`,
      score,
    });
  }
  for (const exam of snap.exams) {
    const d = diffDays(exam.date, today);
    if (d < 0 || d > 14) continue;
    const score = 8 + (d <= 1 ? 6 : d <= 3 ? 4 : d <= 7 ? 2 : 0);
    items.push({
      key: `examen:${exam.id}`,
      kind: "examen",
      id: exam.id,
      title: exam.title,
      reason: d === 0 ? "Examen hoy" : d === 1 ? "Examen mañana" : `Examen en ${d} días`,
      score,
    });
  }
  return items.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 3);
}

export function nextClass(snap: Snapshot, now = new Date()) {
  const today = todayISO(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  for (let i = 0; i < 10; i++) {
    const date = addDays(today, i);
    for (const block of classesOn(snap.blocks, date)) {
      const start = timeToMin(block.start);
      const end = timeToMin(block.end);
      if (i === 0 && end <= nowMin) continue;
      const subject = subjectById(snap, block.subjectId);
      const live = i === 0 && start <= nowMin && nowMin < end;
      return { block, subject, date, live };
    }
  }
  return null;
}

export function isDailyScheduled(habit: Habit, date: string): boolean {
  if (habit.freq.kind !== "daily") return false;
  return habit.freq.days.includes(dow(date));
}

export function habitMark(logs: HabitLog[], habitId: string, date: string) {
  return logs.find((l) => l.habitId === habitId && l.date === date)?.mark;
}

export function periodCount(habit: Habit, logs: HabitLog[], date: string): { done: number; target: number } {
  if (habit.freq.kind === "daily") {
    return { done: habitMark(logs, habit.id, date) === "hecho" ? 1 : 0, target: 1 };
  }
  if (habit.freq.kind === "weekly") {
    const start = isoWeekKey(date);
    let done = 0;
    for (let i = 0; i < 7; i++) {
      if (habitMark(logs, habit.id, addDays(start, i)) === "hecho") done++;
    }
    return { done, target: habit.freq.target };
  }
  const key = monthKey(date);
  const done = logs.filter((l) => l.habitId === habit.id && l.date.startsWith(key) && l.mark === "hecho").length;
  return { done, target: habit.freq.target };
}

export function habitStreak(habit: Habit, logs: HabitLog[], today: string): number {
  if (habit.freq.kind === "daily") {
    let streak = 0;
    const todayDow = dow(today);
    const scheduledToday = habit.freq.days.includes(todayDow);
    const mark = habitMark(logs, habit.id, today);
    if (scheduledToday && mark === "hecho") streak = 1;
    for (let i = 1; i < 420; i++) {
      const date = addDays(today, -i);
      if (!habit.freq.days.includes(dow(date))) continue;
      const m = habitMark(logs, habit.id, date);
      if (m === "hecho") streak++;
      else if (m === "omitido" || m === "na") continue;
      else break;
    }
    return streak;
  }
  const target = habit.freq.target;
  let streak = 0;
  if (habit.freq.kind === "weekly") {
    let cursor = isoWeekKey(today);
    const current = periodCount(habit, logs, today).done >= target;
    if (current) streak = 1;
    for (let i = 1; i < 60; i++) {
      cursor = addDays(cursor, -7);
      if (periodCount(habit, logs, cursor).done >= target) streak++;
      else break;
    }
    return streak;
  }
  let cursor = monthKey(today);
  const met = (key: string) =>
    logs.filter((l) => l.habitId === habit.id && l.date.startsWith(key) && l.mark === "hecho").length >= target;
  if (met(cursor)) streak = 1;
  for (let i = 0; i < 24; i++) {
    const [y, m] = cursor.split("-").map(Number);
    const prev = new Date(y || 1970, (m || 1) - 2, 1);
    cursor = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
    if (met(cursor)) streak++;
    else break;
  }
  return streak;
}

export function routineLog(logs: RoutineLog[], routineId: string, date: string) {
  return logs.find((l) => l.routineId === routineId && l.date === date);
}

export function routineComplete(routine: Routine, logs: RoutineLog[], date: string): boolean {
  if (routine.steps.length === 0) return false;
  const log = routineLog(logs, routine.id, date);
  return routine.steps.every((s) => log?.doneSteps.includes(s.id));
}

export function dayProgress(snap: Snapshot, date: string): { done: number; total: number } {
  const tasks = snap.tasks.filter((t) => t.status !== "cancelada" && t.dueDate === date);
  const habits = snap.habits.filter((h) => isDailyScheduled(h, date));
  const routines = snap.routines.filter((r) => !r.paused && r.days.includes(dow(date)));
  const done =
    tasks.filter((t) => t.status === "hecha").length +
    habits.filter((h) => habitMark(snap.habitLogs, h.id, date) === "hecho").length +
    routines.filter((r) => routineComplete(r, snap.routineLogs, date)).length;
  return { done, total: tasks.length + habits.length + routines.length };
}

export function searchAll(snap: Snapshot, q: string): SearchHit[] {
  const query = q.trim().toLocaleLowerCase("es");
  if (!query) return [];
  const hits: SearchHit[] = [];
  const has = (...parts: (string | undefined)[]) => parts.some((p) => p?.toLocaleLowerCase("es").includes(query));
  for (const s of snap.subjects) {
    if (has(s.name, s.teacher, s.room, s.notes))
      hits.push({ kind: "Materia", id: s.id, title: s.name, subtitle: s.teacher, view: "colegio" });
  }
  for (const t of snap.tasks) {
    if (has(t.title, t.description, t.notes, subjectName(snap, t.subjectId)))
      hits.push({ kind: "Tarea", id: t.id, title: t.title, subtitle: t.dueDate ? prettyShort(t.dueDate) : "Sin fecha", view: "colegio" });
  }
  for (const e of snap.exams) {
    if (has(e.title, e.topics, e.notes, subjectName(snap, e.subjectId)))
      hits.push({ kind: "Examen", id: e.id, title: e.title, subtitle: prettyShort(e.date), view: "colegio" });
  }
  for (const ev of snap.events) {
    if (has(ev.title, ev.description, ev.category))
      hits.push({ kind: "Evento", id: ev.id, title: ev.title, subtitle: prettyShort(ev.date), view: "agenda" });
  }
  for (const r of snap.routines) {
    if (has(r.title, ...r.steps.map((s) => s.title)))
      hits.push({ kind: "Rutina", id: r.id, title: r.title, subtitle: r.time, view: "vida" });
  }
  for (const h of snap.habits) {
    if (has(h.title)) hits.push({ kind: "Hábito", id: h.id, title: h.title, subtitle: "Hábito", view: "vida" });
  }
  for (const n of snap.notes) {
    if (has(n.title, n.content, n.category, n.tags.join(" ")))
      hits.push({ kind: "Nota", id: n.id, title: n.title || "Sin título", subtitle: n.category || "Nota", view: "notas" });
  }
  for (const i of snap.inbox) {
    if (!i.archived && has(i.title, i.notes, i.category))
      hits.push({ kind: "Pendiente", id: i.id, title: i.title, subtitle: i.category || "Bandeja", view: "pendientes" });
  }
  for (const s of snap.sessions) {
    if (has(s.title))
      hits.push({ kind: "Estudio", id: s.id, title: s.title, subtitle: prettyShort(s.date), view: "estudio" });
  }
  return hits.slice(0, 40);
}

export function proposeWeek(snap: Snapshot, weekStart: string, now = new Date()): Proposal[] {
  const today = todayISO(now);
  const weekEnd = addDays(weekStart, 6);
  const occupied = (date: string) =>
    agendaOn(snap, date)
      .filter((i) => i.start && i.end && i.source !== "tarea")
      .map((i) => [timeToMin(i.start!), timeToMin(i.end!)] as const);

  type Job = {
    title: string;
    minutes: number;
    due: string;
    taskId?: string;
    examId?: string;
    subjectId?: string;
    reason: string;
  };
  const jobs: Job[] = [];
  for (const task of snap.tasks) {
    if (task.status !== "pendiente" || !task.dueDate) continue;
    if (task.dueDate > addDays(weekEnd, 3)) continue;
    const planned = snap.sessions
      .filter((s) => s.taskId === task.id && s.status !== "cancelada")
      .reduce((sum, s) => sum + s.plannedMinutes, 0);
    const need = Math.max(0, (task.estimatedMinutes ?? 40) - planned);
    if (need < 20) continue;
    jobs.push({
      title: task.title,
      minutes: need,
      due: task.dueDate < today ? addDays(today, 1) : task.dueDate,
      taskId: task.id,
      subjectId: task.subjectId,
      reason: task.dueDate < today ? "Atrasada, con tu autorización" : `Antes del ${prettyShort(task.dueDate)}`,
    });
  }
  for (const exam of snap.exams) {
    if (exam.date < today || exam.date > addDays(weekEnd, 10)) continue;
    const planned = snap.sessions
      .filter((s) => s.examId === exam.id && s.status !== "cancelada")
      .reduce((sum, s) => sum + s.plannedMinutes, 0);
    const need = Math.max(0, 80 - planned);
    if (need < 20) continue;
    jobs.push({
      title: `Estudiar: ${exam.title}`,
      minutes: need,
      due: exam.date,
      examId: exam.id,
      subjectId: exam.subjectId,
      reason: "Preparación para el examen",
    });
  }
  jobs.sort((a, b) => a.due.localeCompare(b.due));

  const placed: { date: string; start: number; end: number }[] = [];
  const proposals: Proposal[] = [];
  const workStart = 16 * 60;
  const workEnd = 20 * 60 + 30;

  const findSlot = (due: string, chunk: number) => {
    const from = weekStart < today ? today : weekStart;
    const last = due < from ? from : due < weekEnd ? due : weekEnd;
    for (let date = from; date <= last; date = addDays(date, 1)) {
      const blocks = [
        ...occupied(date),
        ...placed.filter((p) => p.date === date).map((p) => [p.start, p.end] as const),
      ];
      let cursor = workStart;
      if (date === today) cursor = Math.max(cursor, Math.ceil((now.getHours() * 60 + now.getMinutes()) / 10) * 10);
      while (cursor + chunk <= workEnd) {
        const end = cursor + chunk;
        if (!blocks.some(([a, b]) => overlaps(cursor, end, a, b))) return { date, start: cursor, end };
        cursor += 10;
      }
    }
    return null;
  };

  for (const job of jobs) {
    let left = job.minutes;
    let guard = 0;
    while (left >= 20 && guard < 4) {
      guard++;
      const chunk = Math.min(50, left);
      const slot = findSlot(job.due, chunk);
      if (!slot) break;
      placed.push(slot);
      proposals.push({
        id: `prop-${job.taskId ?? job.examId}-${slot.date}-${slot.start}`,
        date: slot.date,
        start: minToTime(slot.start),
        end: minToTime(slot.end),
        title: job.title,
        reason: job.reason,
        minutes: chunk,
        taskId: job.taskId,
        examId: job.examId,
        subjectId: job.subjectId,
      });
      left -= chunk;
    }
  }
  return proposals;
}

export type Stats = {
  tasksDone: number;
  tasksOnTime: number;
  tasksLate: number;
  tasksPending: number;
  tasksCancelled: number;
  examsUpcoming: number;
  examsPast: number;
  focusMinutes: number;
  sessionsDone: number;
  habitRate: number;
  habitDone: number;
  habitMissed: number;
  habitSkipped: number;
  routineRate: number;
  routineDone: number;
  routineScheduled: number;
  weekBars: { d: string; minutos: number; tareas: number }[];
};

export function computeStats(snap: Snapshot, today = todayISO()): Stats {
  const weekStart = startOfWeek(today);
  const tasksDone = snap.tasks.filter((t) => t.status === "hecha");
  let onTime = 0;
  let late = 0;
  for (const t of tasksDone) {
    if (!t.dueDate || !t.completedAt) continue;
    const doneDay = t.completedAt.slice(0, 10);
    if (doneDay <= t.dueDate) onTime++;
    else late++;
  }
  let habitDone = 0;
  let habitMissed = 0;
  let habitSkipped = 0;
  for (const habit of snap.habits) {
    if (habit.freq.kind !== "daily") {
      const count = periodCount(habit, snap.habitLogs, today);
      habitDone += Math.min(count.done, count.target);
      continue;
    }
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      if (date > today) continue;
      if (!habit.freq.days.includes(dow(date))) continue;
      const mark = habitMark(snap.habitLogs, habit.id, date);
      if (mark === "hecho") habitDone++;
      else if (mark === "omitido") habitSkipped++;
      else if (mark === "na") continue;
      else if (date < today) habitMissed++;
    }
  }
  let routineDone = 0;
  let routineScheduled = 0;
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    if (date > today) continue;
    for (const routine of snap.routines) {
      if (routine.paused || !routine.days.includes(dow(date))) continue;
      routineScheduled++;
      if (routineComplete(routine, snap.routineLogs, date)) routineDone++;
    }
  }
  const month = monthKey(today);
  const focusMinutes = snap.sessions
    .filter((s) => s.status === "completada" && s.date.startsWith(month))
    .reduce((sum, s) => sum + s.focusMinutes, 0);
  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      d: ["L", "M", "X", "J", "V", "S", "D"][i] || "",
      minutos: snap.sessions
        .filter((s) => s.date === date && s.status === "completada")
        .reduce((sum, s) => sum + s.focusMinutes, 0),
      tareas: snap.tasks.filter((t) => t.status === "hecha" && t.completedAt?.slice(0, 10) === date).length,
    };
  });
  const habitDenom = habitDone + habitMissed;
  return {
    tasksDone: tasksDone.length,
    tasksOnTime: onTime,
    tasksLate: late,
    tasksPending: snap.tasks.filter((t) => t.status === "pendiente").length,
    tasksCancelled: snap.tasks.filter((t) => t.status === "cancelada").length,
    examsUpcoming: snap.exams.filter((e) => e.date >= today).length,
    examsPast: snap.exams.filter((e) => e.date < today).length,
    focusMinutes,
    sessionsDone: snap.sessions.filter((s) => s.status === "completada" && s.date.startsWith(month)).length,
    habitRate: habitDenom === 0 ? 0 : Math.round((habitDone / habitDenom) * 100),
    habitDone,
    habitMissed,
    habitSkipped,
    routineRate: routineScheduled === 0 ? 0 : Math.round((routineDone / routineScheduled) * 100),
    routineDone,
    routineScheduled,
    weekBars,
  };
}

export function reminderMoments(date: string, time: string | undefined, offsets: number[], now = new Date()) {
  if (!date) return [];
  const base = combine(date, time || "08:00").getTime();
  return offsets.map((offset) => ({ offset, at: base - offset * 60000 })).filter((r) => r.at <= now.getTime() && now.getTime() - r.at < 6 * 3600000);
}

export function reminderCopy(kind: string, title: string, whenLabel: string): { title: string; body: string } {
  if (kind === "examen") return { title: "LifeOS", body: `Tu examen de ${title} ${whenLabel}.` };
  if (kind === "rutina") return { title: "LifeOS", body: `Es hora de comenzar tu rutina: ${title}.` };
  if (kind === "estudio") return { title: "LifeOS", body: "Tenés una sesión de estudio programada." };
  if (kind === "noche") return { title: "LifeOS", body: "Revisá tus pendientes para mañana." };
  return { title: "LifeOS", body: `${whenLabel} ${title}.`.replace(/\s+/g, " ").trim() };
}

export function currentFocusMs(run: { accumulatedMs: number; runningSince: number | null }, now = Date.now()) {
  return run.accumulatedMs + (run.runningSince ? Math.max(0, now - run.runningSince) : 0);
}

export { nowTime };
