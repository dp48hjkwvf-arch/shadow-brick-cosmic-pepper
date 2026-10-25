import type {
  CalEvent,
  Exam,
  Habit,
  InboxItem,
  Note,
  Routine,
  Session,
  Snapshot,
  Subject,
  Task,
} from "./types";

export function newId(): string {
  return crypto.randomUUID();
}

export function blankSubject(partial: Partial<Subject> = {}): Subject {
  return {
    id: newId(),
    name: "",
    teacher: "",
    room: "",
    tone: "sage",
    notes: "",
    ...partial,
  };
}

export function blankTask(partial: Partial<Task> = {}): Task {
  return {
    id: newId(),
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    importance: "media",
    urgencyMode: "auto",
    status: "pendiente",
    subtasks: [],
    notes: "",
    attachments: [],
    reminderOffsets: [],
    pinned: false,
    ...partial,
  };
}

export function blankExam(partial: Partial<Exam> = {}): Exam {
  return {
    id: newId(),
    title: "",
    date: "",
    topics: "",
    notes: "",
    reminderOffsets: [1440],
    ...partial,
  };
}

export function blankEvent(partial: Partial<CalEvent> = {}): CalEvent {
  return {
    id: newId(),
    title: "",
    date: "",
    description: "",
    category: "Personal",
    importance: "media",
    reminderOffsets: [],
    recurrence: null,
    exceptions: [],
    ...partial,
  };
}

export function blankRoutine(partial: Partial<Routine> = {}): Routine {
  return {
    id: newId(),
    title: "",
    time: "07:00",
    durationMin: 20,
    days: [1, 2, 3, 4, 5],
    steps: [],
    paused: false,
    reminderOffsets: [0],
    ...partial,
  };
}

export function blankHabit(partial: Partial<Habit> = {}): Habit {
  return {
    id: newId(),
    title: "",
    freq: { kind: "daily", days: [1, 2, 3, 4, 5, 6, 0] },
    tone: "sage",
    ...partial,
  };
}

export function blankNote(partial: Partial<Note> = {}): Note {
  return {
    id: newId(),
    title: "",
    content: "",
    category: "",
    tags: [],
    links: [],
    updatedAt: new Date().toISOString(),
    ...partial,
  };
}

export function blankSession(partial: Partial<Session> = {}): Session {
  return {
    id: newId(),
    title: "",
    date: "",
    plannedMinutes: 25,
    focusMinutes: 0,
    status: "planificada",
    ...partial,
  };
}

export function blankInbox(partial: Partial<InboxItem> = {}): InboxItem {
  return {
    id: newId(),
    title: "",
    notes: "",
    category: "",
    createdAt: new Date().toISOString(),
    archived: false,
    ...partial,
  };
}

export function emptySnapshot(): Snapshot {
  return {
    version: 1,
    subjects: [],
    blocks: [],
    tasks: [],
    exams: [],
    events: [],
    routines: [],
    routineLogs: [],
    habits: [],
    habitLogs: [],
    sessions: [],
    notes: [],
    inbox: [],
    backpack: [
      { id: "bp-mochila", label: "Mochila" },
      { id: "bp-cuadernos", label: "Cuadernos y tareas" },
      { id: "bp-utiles", label: "Útiles" },
      { id: "bp-agua", label: "Botella de agua" },
    ],
    backpackChecks: {},
    fired: [],
    notices: [],
    prefs: {
      theme: "sistema",
      displayName: "",
      nightReminder: null,
      sample: false,
      notifyHintDismissed: false,
      installHintDismissed: false,
    },
    focus: null,
  };
}
