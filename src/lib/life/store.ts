import { create } from "zustand";
import { addDays, todayISO } from "./dates";
import { blankEvent, blankTask, emptySnapshot, newId } from "./factory";
import { idbGet, idbSet } from "./idb";
import { eventOccursOn, eventView, reminderCopy, reminderMoments } from "./logic";
import { showLocalNotice } from "./notify";
import { buildSeed } from "./seed";
import type {
  Block,
  CalEvent,
  EventException,
  Exam,
  FocusRun,
  Habit,
  HabitMark,
  InboxItem,
  Note,
  Prefs,
  Proposal,
  Routine,
  Session,
  Snapshot,
  Subject,
  Task,
  TaskStatus,
  ViewId,
} from "./types";

const KEY = "snapshot";

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let starting = false;

function queueSave(snap: Snapshot) {
  if (typeof indexedDB === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void idbSet(KEY, snap);
  }, 160);
}

async function saveNow(snap: Snapshot) {
  if (saveTimer) clearTimeout(saveTimer);
  if (typeof indexedDB === "undefined") return;
  await idbSet(KEY, snap);
}

function withDefaults(saved: Snapshot): Snapshot {
  const base = emptySnapshot();
  return {
    ...base,
    ...saved,
    version: 1,
    prefs: { ...base.prefs, ...saved.prefs },
    backpack: saved.backpack?.length ? saved.backpack : base.backpack,
    focus: saved.focus ?? null,
    fired: saved.fired ?? [],
    notices: saved.notices ?? [],
    backpackChecks: saved.backpackChecks ?? {},
  };
}

export function normalizeImport(raw: unknown): Snapshot {
  if (!raw || typeof raw !== "object") throw new Error("Ese archivo no es una copia de LifeOS.");
  const data = raw as Partial<Snapshot>;
  if (data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.subjects)) {
    throw new Error("La copia no tiene el formato de LifeOS.");
  }
  return withDefaults(data as Snapshot);
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const i = list.findIndex((x) => x.id === item.id);
  if (i === -1) return [item, ...list];
  const next = list.slice();
  next[i] = item;
  return next;
}

type LifeState = {
  snap: Snapshot;
  ready: boolean;
  init: () => Promise<void>;
  persist: () => Promise<void>;
  update: (fn: (snap: Snapshot) => Snapshot) => void;
  upsertSubject: (item: Subject) => void;
  deleteSubject: (id: string) => void;
  upsertBlock: (item: Block) => void;
  deleteBlock: (id: string) => void;
  cancelBlockOn: (blockId: string, date: string) => void;
  upsertTask: (item: Task) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  upsertExam: (item: Exam) => void;
  deleteExam: (id: string) => void;
  upsertEvent: (item: CalEvent) => void;
  deleteEvent: (id: string) => void;
  skipEventOn: (id: string, date: string) => void;
  overrideEventOn: (id: string, date: string, patch: Extract<EventException, { type: "override" }>) => void;
  upsertRoutine: (item: Routine) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutinePause: (id: string) => void;
  toggleStep: (routineId: string, date: string, stepId: string) => void;
  upsertHabit: (item: Habit) => void;
  deleteHabit: (id: string) => void;
  markHabit: (habitId: string, date: string, mark: HabitMark | null) => void;
  upsertSession: (item: Session) => void;
  deleteSession: (id: string) => void;
  acceptProposals: (items: Proposal[]) => void;
  upsertNote: (item: Note) => void;
  deleteNote: (id: string) => void;
  upsertInbox: (item: InboxItem) => void;
  deleteInbox: (id: string) => void;
  convertInbox: (id: string, kind: "tarea" | "evento" | "recordatorio") => string | null;
  addBackpack: (label: string) => void;
  deleteBackpack: (id: string) => void;
  toggleBackpack: (date: string, id: string) => void;
  setPrefs: (partial: Partial<Prefs>) => void;
  setFocus: (focus: FocusRun | null) => void;
  patchFocus: (partial: Partial<FocusRun>) => void;
  dismissNotice: (id: string) => void;
  flushReminders: () => void;
  emptyAll: () => void;
  loadSample: () => void;
  importSnap: (snap: Snapshot) => void;
};

export const useLife = create<LifeState>((set, get) => {
  const update = (fn: (snap: Snapshot) => Snapshot) => {
    const next = fn(get().snap);
    set({ snap: next });
    queueSave(next);
  };

  return {
    snap: emptySnapshot(),
    ready: false,
    update,
    async init() {
      if (get().ready || starting) return;
      starting = true;
      try {
        const saved = await idbGet<Snapshot>(KEY);
        const snap = saved ? withDefaults(saved) : buildSeed();
        set({ snap, ready: true });
        if (!saved) await saveNow(snap);
      } catch {
        const snap = buildSeed();
        set({ snap, ready: true });
      }
      const persist = () => {
        void saveNow(get().snap);
      };
      window.addEventListener("pagehide", persist);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") persist();
      });
    },
    async persist() {
      await saveNow(get().snap);
    },
    upsertSubject: (item) => update((s) => ({ ...s, subjects: upsert(s.subjects, item) })),
    deleteSubject: (id) =>
      update((s) => ({
        ...s,
        subjects: s.subjects.filter((x) => x.id !== id),
        blocks: s.blocks.filter((b) => b.subjectId !== id),
        tasks: s.tasks.map((t) => (t.subjectId === id ? { ...t, subjectId: undefined } : t)),
      })),
    upsertBlock: (item) => update((s) => ({ ...s, blocks: upsert(s.blocks, item) })),
    deleteBlock: (id) => update((s) => ({ ...s, blocks: s.blocks.filter((b) => b.id !== id && b.replacesId !== id && b.cancelOf !== id) })),
    cancelBlockOn: (blockId, date) =>
      update((s) => {
        const id = `cancel-${blockId}-${date}`;
        if (s.blocks.some((b) => b.id === id)) return s;
        const base = s.blocks.find((b) => b.id === blockId);
        if (!base) return s;
        const cancel: Block = {
          ...base,
          id,
          scope: "once",
          date,
          cancelOf: blockId,
          replacesId: undefined,
        };
        return { ...s, blocks: [...s.blocks, cancel] };
      }),
    upsertTask: (item) => update((s) => ({ ...s, tasks: upsert(s.tasks, item) })),
    deleteTask: (id) => update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) })),
    setTaskStatus: (id, status) =>
      update((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                completedAt: status === "hecha" ? new Date().toISOString() : undefined,
              }
            : t,
        ),
      })),
    toggleSubtask: (taskId, subId) =>
      update((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? { ...t, subtasks: t.subtasks.map((st) => (st.id === subId ? { ...st, done: !st.done } : st)) }
            : t,
        ),
      })),
    upsertExam: (item) => update((s) => ({ ...s, exams: upsert(s.exams, item) })),
    deleteExam: (id) => update((s) => ({ ...s, exams: s.exams.filter((e) => e.id !== id) })),
    upsertEvent: (item) => update((s) => ({ ...s, events: upsert(s.events, item) })),
    deleteEvent: (id) => update((s) => ({ ...s, events: s.events.filter((e) => e.id !== id) })),
    skipEventOn: (id, date) =>
      update((s) => ({
        ...s,
        events: s.events.map((ev) => {
          if (ev.id !== id) return ev;
          const exceptions = ev.exceptions.filter((e) => e.date !== date);
          if (!ev.recurrence && ev.date === date) return ev;
          return { ...ev, exceptions: [...exceptions, { date, type: "skip" as const }] };
        }),
      })),
    overrideEventOn: (id, date, patch) =>
      update((s) => ({
        ...s,
        events: s.events.map((ev) => {
          if (ev.id !== id) return ev;
          const exceptions = ev.exceptions.filter((e) => e.date !== date);
          return { ...ev, exceptions: [...exceptions, patch] };
        }),
      })),
    upsertRoutine: (item) => update((s) => ({ ...s, routines: upsert(s.routines, item) })),
    deleteRoutine: (id) =>
      update((s) => ({
        ...s,
        routines: s.routines.filter((r) => r.id !== id),
        routineLogs: s.routineLogs.filter((l) => l.routineId !== id),
      })),
    toggleRoutinePause: (id) =>
      update((s) => ({
        ...s,
        routines: s.routines.map((r) => (r.id === id ? { ...r, paused: !r.paused } : r)),
      })),
    toggleStep: (routineId, date, stepId) =>
      update((s) => {
        const existing = s.routineLogs.find((l) => l.routineId === routineId && l.date === date);
        const done = new Set(existing?.doneSteps ?? []);
        if (done.has(stepId)) done.delete(stepId);
        else done.add(stepId);
        const log = { routineId, date, doneSteps: [...done] };
        const routineLogs = existing
          ? s.routineLogs.map((l) => (l === existing ? log : l))
          : [...s.routineLogs, log];
        return { ...s, routineLogs };
      }),
    upsertHabit: (item) => update((s) => ({ ...s, habits: upsert(s.habits, item) })),
    deleteHabit: (id) =>
      update((s) => ({
        ...s,
        habits: s.habits.filter((h) => h.id !== id),
        habitLogs: s.habitLogs.filter((l) => l.habitId !== id),
      })),
    markHabit: (habitId, date, mark) =>
      update((s) => {
        const habitLogs = s.habitLogs.filter((l) => !(l.habitId === habitId && l.date === date));
        if (mark) habitLogs.push({ habitId, date, mark });
        return { ...s, habitLogs };
      }),
    upsertSession: (item) => update((s) => ({ ...s, sessions: upsert(s.sessions, item) })),
    deleteSession: (id) => update((s) => ({ ...s, sessions: s.sessions.filter((x) => x.id !== id) })),
    acceptProposals: (items) =>
      update((s) => {
        let sessions = s.sessions;
        for (const item of items) {
          const session: Session = {
            id: item.id,
            title: item.title,
            date: item.date,
            start: item.start,
            plannedMinutes: item.minutes,
            focusMinutes: 0,
            status: "planificada",
            taskId: item.taskId,
            examId: item.examId,
            subjectId: item.subjectId,
          };
          sessions = upsert(sessions, session);
        }
        return { ...s, sessions };
      }),
    upsertNote: (item) => update((s) => ({ ...s, notes: upsert(s.notes, { ...item, updatedAt: new Date().toISOString() }) })),
    deleteNote: (id) => update((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
    upsertInbox: (item) => update((s) => ({ ...s, inbox: upsert(s.inbox, item) })),
    deleteInbox: (id) => update((s) => ({ ...s, inbox: s.inbox.filter((i) => i.id !== id) })),
    convertInbox: (id, kind) => {
      const item = get().snap.inbox.find((i) => i.id === id);
      if (!item) return null;
      if (item.converted) {
        const exists =
          (item.converted.kind === "tarea" && get().snap.tasks.some((t) => t.id === item.converted?.id)) ||
          (item.converted.kind !== "tarea" && get().snap.events.some((e) => e.id === item.converted?.id));
        if (exists) return item.converted.id;
      }
      const created = newId();
      update((s) => {
        const inbox = s.inbox.map((i) => (i.id === id ? { ...i, archived: true, converted: { kind, id: created } } : i));
        if (kind === "tarea") {
          return {
            ...s,
            inbox,
            tasks: [
              blankTask({
                id: created,
                title: item.title,
                description: item.notes,
                reminderOffsets: [],
              }),
              ...s.tasks,
            ],
          };
        }
        const tomorrow = addDays(todayISO(), 1);
        return {
          ...s,
          inbox,
          events: [
            blankEvent({
              id: created,
              title: item.title,
              description: item.notes,
              date: tomorrow,
              time: kind === "recordatorio" ? "09:00" : undefined,
              category: kind === "recordatorio" ? "Recordatorio" : "Personal",
              reminderOffsets: kind === "recordatorio" ? [0] : [],
            }),
            ...s.events,
          ],
        };
      });
      return created;
    },
    addBackpack: (label) =>
      update((s) => ({ ...s, backpack: [...s.backpack, { id: newId(), label: label.trim() }] })),
    deleteBackpack: (id) => update((s) => ({ ...s, backpack: s.backpack.filter((b) => b.id !== id) })),
    toggleBackpack: (date, id) =>
      update((s) => {
        const current = new Set(s.backpackChecks[date] ?? []);
        if (current.has(id)) current.delete(id);
        else current.add(id);
        return { ...s, backpackChecks: { ...s.backpackChecks, [date]: [...current] } };
      }),
    setPrefs: (partial) => update((s) => ({ ...s, prefs: { ...s.prefs, ...partial } })),
    setFocus: (focus) => update((s) => ({ ...s, focus })),
    patchFocus: (partial) => update((s) => ({ ...s, focus: s.focus ? { ...s.focus, ...partial } : s.focus })),
    dismissNotice: (id) => update((s) => ({ ...s, notices: s.notices.filter((n) => n.id !== id) })),
    flushReminders: () => {
      const snap = get().snap;
      const now = new Date();
      const today = todayISO(now);
      const fired = new Set(snap.fired);
      const fresh: Snapshot["notices"] = [];
      const push = (key: string, title: string, body: string, view: ViewId) => {
        if (fired.has(key)) return;
        fired.add(key);
        fresh.push({ id: newId(), at: now.toISOString(), title, body, view, read: false });
        void showLocalNotice(title, body, view, key);
      };
      for (const task of snap.tasks) {
        if (task.status !== "pendiente" || !task.dueDate) continue;
        for (const moment of reminderMoments(task.dueDate, task.dueTime, task.reminderOffsets, now)) {
          const soon = task.dueDate === today ? "es hoy:" : "se acerca:";
          const copy = reminderCopy("tarea", task.title, `Mañana no: ${soon}`);
          const body =
            task.dueDate === addDays(today, 1)
              ? `Mañana tenés que entregar: ${task.title}.`
              : task.dueDate === today
                ? `Hoy tenés que entregar: ${task.title}.`
                : `Recordatorio: ${task.title}.`;
          push(`tarea:${task.id}:${moment.offset}:${moment.at}`, copy.title, body, "colegio");
        }
      }
      for (const exam of snap.exams) {
        for (const moment of reminderMoments(exam.date, exam.time, exam.reminderOffsets, now)) {
          const when = exam.date === addDays(today, 1) ? "es mañana" : exam.date === today ? "es hoy" : "se acerca";
          const copy = reminderCopy("examen", exam.title, when);
          push(`examen:${exam.id}:${moment.offset}:${moment.at}`, copy.title, copy.body, "colegio");
        }
      }
      for (const routine of snap.routines) {
        if (routine.paused || !routine.days.includes(now.getDay())) continue;
        for (const moment of reminderMoments(today, routine.time, routine.reminderOffsets, now)) {
          const copy = reminderCopy("rutina", routine.title, "");
          push(`rutina:${routine.id}:${today}:${moment.offset}`, copy.title, copy.body, "vida");
        }
      }
      for (const session of snap.sessions) {
        if (session.status !== "planificada" || !session.start) continue;
        for (const moment of reminderMoments(session.date, session.start, [0], now)) {
          const copy = reminderCopy("estudio", session.title, "");
          push(`estudio:${session.id}:${moment.offset}:${moment.at}`, copy.title, `${copy.body} ${session.title}`.trim(), "estudio");
        }
      }
      for (const ev of snap.events) {
        for (const date of [today, addDays(today, 1)]) {
          if (!eventOccursOn(ev, date)) continue;
          const view = eventView(ev, date);
          if (!view.time) continue;
          for (const moment of reminderMoments(date, view.time, ev.reminderOffsets, now)) {
            push(`evento:${ev.id}:${date}:${moment.offset}:${moment.at}`, "LifeOS", `Tenés un evento: ${view.title}.`, "agenda");
          }
        }
      }
      if (snap.prefs.nightReminder) {
        for (const moment of reminderMoments(today, snap.prefs.nightReminder, [0], now)) {
          const copy = reminderCopy("noche", "", "");
          push(`noche:${today}:${moment.at}`, copy.title, copy.body, "manana");
        }
      }
      if (!fresh.length) return;
      update((s) => ({
        ...s,
        fired: [...fired].slice(-500),
        notices: [...fresh, ...s.notices].slice(0, 20),
      }));
    },
    emptyAll: () => {
      const snap = emptySnapshot();
      set({ snap });
      void saveNow(snap);
    },
    loadSample: () => {
      const snap = buildSeed();
      set({ snap });
      void saveNow(snap);
    },
    importSnap: (snap) => {
      const next = withDefaults(snap);
      set({ snap: next });
      void saveNow(next);
    },
  };
});
