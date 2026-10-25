export type Id = string;
export type Day = string;
export type Time = string;
export type Importance = "baja" | "media" | "alta";
export type UrgencyMode = "auto" | "sin-apuro" | "proxima" | "hoy" | "vencida";
export type Urgency = Exclude<UrgencyMode, "auto">;
export type TaskStatus = "pendiente" | "hecha" | "cancelada";
export type Tone = "sage" | "clay" | "ink";
export type HabitMark = "hecho" | "omitido" | "na";

export type ViewId =
  | "hoy"
  | "colegio"
  | "agenda"
  | "vida"
  | "mas"
  | "pendientes"
  | "estudio"
  | "manana"
  | "semana"
  | "notas"
  | "stats"
  | "ajustes"
  | "buscar";

export const VIEW_IDS: ViewId[] = [
  "hoy",
  "colegio",
  "agenda",
  "vida",
  "mas",
  "pendientes",
  "estudio",
  "manana",
  "semana",
  "notas",
  "stats",
  "ajustes",
  "buscar",
];

export type Subject = {
  id: Id;
  name: string;
  teacher: string;
  room: string;
  tone: Tone;
  notes: string;
};

export type Block = {
  id: Id;
  subjectId: Id;
  dayOfWeek: number;
  start: Time;
  end: Time;
  room: string;
  scope: "regular" | "once";
  date?: Day;
  replacesId?: Id;
  cancelOf?: Id;
};

export type Subtask = { id: Id; title: string; done: boolean };
export type Attachment = { id: Id; name: string; dataUrl: string };

export type Task = {
  id: Id;
  title: string;
  subjectId?: Id;
  description: string;
  createdAt: string;
  dueDate?: Day;
  dueTime?: Time;
  importance: Importance;
  urgencyMode: UrgencyMode;
  status: TaskStatus;
  estimatedMinutes?: number;
  subtasks: Subtask[];
  notes: string;
  attachments: Attachment[];
  reminderOffsets: number[];
  pinned: boolean;
  completedAt?: string;
};

export type Exam = {
  id: Id;
  title: string;
  subjectId?: Id;
  date: Day;
  time?: Time;
  topics: string;
  notes: string;
  reminderOffsets: number[];
};

export type Recurrence = {
  freq: "daily" | "weekly" | "monthly";
  interval: number;
  days: number[];
  until?: Day;
};

export type EventException =
  | { date: Day; type: "skip" }
  | {
      date: Day;
      type: "override";
      title?: string;
      time?: Time;
      endTime?: Time;
      description?: string;
      category?: string;
      importance?: Importance;
    };

export type CalEvent = {
  id: Id;
  title: string;
  date: Day;
  time?: Time;
  endTime?: Time;
  description: string;
  category: string;
  importance: Importance;
  reminderOffsets: number[];
  recurrence: Recurrence | null;
  exceptions: EventException[];
};

export type RoutineStep = { id: Id; title: string };

export type Routine = {
  id: Id;
  title: string;
  time: Time;
  durationMin: number;
  days: number[];
  steps: RoutineStep[];
  paused: boolean;
  reminderOffsets: number[];
};

export type RoutineLog = { routineId: Id; date: Day; doneSteps: Id[] };

export type HabitFreq =
  | { kind: "daily"; days: number[] }
  | { kind: "weekly"; target: number }
  | { kind: "monthly"; target: number };

export type Habit = { id: Id; title: string; freq: HabitFreq; tone: Tone };
export type HabitLog = { habitId: Id; date: Day; mark: HabitMark };

export type Session = {
  id: Id;
  title: string;
  subjectId?: Id;
  taskId?: Id;
  examId?: Id;
  date: Day;
  start?: Time;
  plannedMinutes: number;
  focusMinutes: number;
  status: "planificada" | "completada" | "cancelada";
};

export type NoteLink = { kind: "tarea" | "materia" | "evento" | "examen"; id: Id };

export type Note = {
  id: Id;
  title: string;
  content: string;
  category: string;
  tags: string[];
  links: NoteLink[];
  updatedAt: string;
};

export type InboxItem = {
  id: Id;
  title: string;
  notes: string;
  category: string;
  createdAt: string;
  archived: boolean;
  converted?: { kind: "tarea" | "evento" | "recordatorio"; id: Id };
};

export type BackpackItem = { id: Id; label: string };

export type Prefs = {
  theme: "sistema" | "claro" | "oscuro";
  displayName: string;
  nightReminder: Time | null;
  sample: boolean;
  notifyHintDismissed: boolean;
  installHintDismissed: boolean;
};

export type Notice = {
  id: Id;
  at: string;
  title: string;
  body: string;
  view: ViewId;
  read: boolean;
};

export type FocusRun = {
  sessionId: Id;
  title: string;
  targetMinutes: number;
  accumulatedMs: number;
  runningSince: number | null;
  taskId?: Id;
  subjectId?: Id;
  examId?: Id;
};

export type Snapshot = {
  version: 1;
  subjects: Subject[];
  blocks: Block[];
  tasks: Task[];
  exams: Exam[];
  events: CalEvent[];
  routines: Routine[];
  routineLogs: RoutineLog[];
  habits: Habit[];
  habitLogs: HabitLog[];
  sessions: Session[];
  notes: Note[];
  inbox: InboxItem[];
  backpack: BackpackItem[];
  backpackChecks: Record<Day, Id[]>;
  fired: string[];
  notices: Notice[];
  prefs: Prefs;
  focus: FocusRun | null;
};

export type AgendaSource = "clase" | "tarea" | "examen" | "evento" | "rutina" | "estudio";

export type AgendaItem = {
  key: string;
  source: AgendaSource;
  sourceId: Id;
  date: Day;
  start?: Time;
  end?: Time;
  title: string;
  detail: string;
  tone: Tone;
  importance?: Importance;
};

export type PriorityItem = {
  key: string;
  kind: "tarea" | "examen";
  id: Id;
  title: string;
  reason: string;
  score: number;
};

export type Proposal = {
  id: Id;
  date: Day;
  start: Time;
  end: Time;
  title: string;
  reason: string;
  minutes: number;
  taskId?: Id;
  examId?: Id;
  subjectId?: Id;
};

export type SearchHit = {
  kind: string;
  id: Id;
  title: string;
  subtitle: string;
  view: ViewId;
};
