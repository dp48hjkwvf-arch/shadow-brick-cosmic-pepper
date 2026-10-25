import { useState } from "react";
import { toast } from "sonner";
import { todayISO } from "@/lib/life/dates";
import {
  blankEvent,
  blankExam,
  blankHabit,
  blankInbox,
  blankNote,
  blankRoutine,
  blankSession,
  blankSubject,
  blankTask,
  newId,
} from "@/lib/life/factory";
import { eventView } from "@/lib/life/logic";
import { useLife } from "@/lib/life/store";
import type { Block, HabitFreq, Importance, Tone, UrgencyMode } from "@/lib/life/types";
import { Btn, Field, Panel, fieldClass } from "./ui";

export type Editor =
  | { kind: "rapido" }
  | { kind: "tarea"; id?: string; compact?: boolean }
  | { kind: "examen"; id?: string }
  | { kind: "evento"; id?: string; date?: string; scope?: "serie" | "dia" }
  | { kind: "materia"; id?: string }
  | { kind: "bloque"; id?: string; date?: string }
  | { kind: "habito"; id?: string }
  | { kind: "rutina"; id?: string }
  | { kind: "nota"; id?: string }
  | { kind: "inbox"; id?: string }
  | { kind: "sesion"; id?: string };

const OFFSETS = [
  { m: 0, label: "A la hora" },
  { m: 30, label: "30 min" },
  { m: 120, label: "2 h" },
  { m: 1440, label: "1 día" },
];

const DAYS = [
  { d: 1, l: "L" },
  { d: 2, l: "M" },
  { d: 3, l: "X" },
  { d: 4, l: "J" },
  { d: 5, l: "V" },
  { d: 6, l: "S" },
  { d: 0, l: "D" },
];

function Offsets({ value, onChange }: { value: number[]; onChange: (next: number[]) => void }) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {OFFSETS.map((o) => {
        const on = value.includes(o.m);
        return (
          <button
            key={o.m}
            type="button"
            onClick={() => onChange(on ? value.filter((m) => m !== o.m) : [...value, o.m])}
            className={`min-h-10 rounded-full px-3 text-sm ${on ? "bg-sage text-paper" : "bg-card text-ink border border-line"}`}
            aria-pressed={on}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function DayPicks({ value, onChange }: { value: number[]; onChange: (next: number[]) => void }) {
  return (
    <div className="mb-3 flex gap-1">
      {DAYS.map((day) => {
        const on = value.includes(day.d);
        return (
          <button
            key={day.d}
            type="button"
            onClick={() => onChange(on ? value.filter((d) => d !== day.d) : [...value, day.d])}
            className={`grid size-11 place-items-center rounded-full text-sm ${on ? "bg-sage text-paper" : "bg-card border border-line"}`}
            aria-pressed={on}
          >
            {day.l}
          </button>
        );
      })}
    </div>
  );
}

function SubjectSelect({ value, onChange }: { value?: string; onChange: (id: string) => void }) {
  const subjects = useLife((s) => s.snap.subjects);
  return (
    <select className={fieldClass} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">Sin materia</option>
      {subjects.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}

export function EditorHost({ editor, onClose, onOpen }: { editor: Editor; onClose: () => void; onOpen: (e: Editor) => void }) {
  if (editor.kind === "rapido") return <Quick onClose={onClose} onOpen={onOpen} />;
  if (editor.kind === "tarea") return <TaskForm id={editor.id} compact={editor.compact} onClose={onClose} />;
  if (editor.kind === "examen") return <ExamForm id={editor.id} onClose={onClose} />;
  if (editor.kind === "evento") return <EventForm editor={editor} onClose={onClose} />;
  if (editor.kind === "materia") return <SubjectForm id={editor.id} onClose={onClose} />;
  if (editor.kind === "bloque") return <BlockForm id={editor.id} date={editor.date} onClose={onClose} />;
  if (editor.kind === "habito") return <HabitForm id={editor.id} onClose={onClose} />;
  if (editor.kind === "rutina") return <RoutineForm id={editor.id} onClose={onClose} />;
  if (editor.kind === "nota") return <NoteForm id={editor.id} onClose={onClose} />;
  if (editor.kind === "inbox") return <InboxForm id={editor.id} onClose={onClose} />;
  return <SessionForm id={editor.id} onClose={onClose} />;
}

function Quick({ onClose, onOpen }: { onClose: () => void; onOpen: (e: Editor) => void }) {
  const items: { label: string; hint: string; editor: Editor }[] = [
    { label: "Tarea", hint: "Título, materia y entrega", editor: { kind: "tarea", compact: true } },
    { label: "Evento", hint: "Algo en el calendario", editor: { kind: "evento" } },
    { label: "Recordatorio", hint: "Un aviso con hora", editor: { kind: "evento", date: todayISO() } },
    { label: "Examen", hint: "Fecha, materia y temas", editor: { kind: "examen" } },
    { label: "Hábito", hint: "Una constancia flexible", editor: { kind: "habito" } },
    { label: "Rutina", hint: "Pasos y horario", editor: { kind: "rutina" } },
    { label: "Nota", hint: "Para no olvidarlo", editor: { kind: "nota" } },
    { label: "Pendiente", hint: "Sin fecha, por ahora", editor: { kind: "inbox" } },
  ];
  return (
    <Panel title="Nueva actividad" onClose={onClose}>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onOpen(item.editor)}
            className="min-h-20 rounded-card border border-line bg-card px-3 py-3 text-left"
          >
            <span className="block font-medium">{item.label}</span>
            <span className="mt-1 block text-sm text-ink-soft">{item.hint}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function TaskForm({ id, compact, onClose }: { id?: string; compact?: boolean; onClose: () => void }) {
  const existing = useLife((s) => s.snap.tasks.find((t) => t.id === id));
  const upsert = useLife((s) => s.upsertTask);
  const remove = useLife((s) => s.deleteTask);
  const setStatus = useLife((s) => s.setTaskStatus);
  const [more, setMore] = useState(!compact);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [subjectId, setSubjectId] = useState(existing?.subjectId ?? "");
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? "");
  const [dueTime, setDueTime] = useState(existing?.dueTime ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [importance, setImportance] = useState<Importance>(existing?.importance ?? "media");
  const [urgencyMode, setUrgencyMode] = useState<UrgencyMode>(existing?.urgencyMode ?? "auto");
  const [estimated, setEstimated] = useState(existing?.estimatedMinutes ? String(existing.estimatedMinutes) : "");
  const [offsets, setOffsets] = useState<number[]>(existing?.reminderOffsets ?? (compact ? [1440] : []));
  const [pinned, setPinned] = useState(existing?.pinned ?? false);
  const [subtasks, setSubtasks] = useState(existing?.subtasks ?? []);
  const [sub, setSub] = useState("");
  const [attachments, setAttachments] = useState(existing?.attachments ?? []);

  const save = () => {
    if (!title.trim()) return;
    upsert(
      blankTask({
        ...existing,
        id: existing?.id ?? newId(),
        title: title.trim(),
        subjectId: subjectId || undefined,
        dueDate: dueDate || undefined,
        dueTime: dueTime || undefined,
        description,
        notes,
        importance,
        urgencyMode,
        estimatedMinutes: estimated ? Number(estimated) : undefined,
        reminderOffsets: dueDate ? offsets : [],
        pinned,
        subtasks,
        attachments,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        status: existing?.status ?? "pendiente",
      }),
    );
    onClose();
  };

  return (
    <Panel
      title={existing ? "Tarea" : "Nueva tarea"}
      onClose={onClose}
      footer={<Btn className="w-full" onClick={save}>Guardar</Btn>}
    >
      <Field label="Título">
        <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Qué hay que hacer" />
      </Field>
      <Field label="Materia">
        <SubjectSelect value={subjectId} onChange={setSubjectId} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Entrega">
          <input className={fieldClass} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </Field>
        <Field label="Hora">
          <input className={fieldClass} type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
        </Field>
      </div>
      {!more ? (
        <button type="button" className="mb-4 text-sm text-sage" onClick={() => setMore(true)}>
          Más detalles
        </button>
      ) : (
        <>
          <Field label="Descripción">
            <textarea className={`${fieldClass} py-3`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Importancia">
            <div className="grid grid-cols-3 gap-2">
              {(["baja", "media", "alta"] as Importance[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImportance(level)}
                  className={`min-h-11 rounded-2xl capitalize ${importance === level ? "bg-sage text-paper" : "bg-card border border-line"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Urgencia">
            <select className={fieldClass} value={urgencyMode} onChange={(e) => setUrgencyMode(e.target.value as UrgencyMode)}>
              <option value="auto">Automática, según la fecha</option>
              <option value="sin-apuro">Sin apuro</option>
              <option value="proxima">Próxima</option>
              <option value="hoy">Para hoy</option>
              <option value="vencida">Vencida</option>
            </select>
          </Field>
          <Field label="Minutos estimados">
            <input className={fieldClass} inputMode="numeric" value={estimated} onChange={(e) => setEstimated(e.target.value.replace(/[^\d]/g, ""))} />
          </Field>
          <p className="mb-1 text-sm text-ink-soft">Recordatorios</p>
          <Offsets value={offsets} onChange={setOffsets} />
          <button type="button" className="mb-3 text-sm text-sage" onClick={() => setPinned((v) => !v)}>
            {pinned ? "Fijada en hacé esto primero" : "Fijar en hacé esto primero"}
          </button>
          <Field label="Notas">
            <textarea className={`${fieldClass} py-3`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <p className="mb-2 text-sm text-ink-soft">Subtareas</p>
          <ul className="mb-2">
            {subtasks.map((st) => (
              <li key={st.id}>
                <button type="button" className="flex min-h-11 w-full items-center gap-2 text-left" onClick={() => setSubtasks((list) => list.map((x) => (x.id === st.id ? { ...x, done: !x.done } : x)))}>
                  <span className={`size-4 rounded-full border ${st.done ? "bg-sage border-sage" : "border-line"}`} />
                  <span className={st.done ? "text-ink-soft line-through" : ""}>{st.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mb-3 flex gap-2">
            <input className={fieldClass} value={sub} placeholder="Nuevo paso" onChange={(e) => setSub(e.target.value)} />
            <Btn variant="soft" onClick={() => { if (!sub.trim()) return; setSubtasks((list) => [...list, { id: newId(), title: sub.trim(), done: false }]); setSub(""); }}>Sumar</Btn>
          </div>
          <Field label="Adjunto (hasta 280 KB)">
            <input
              className="block w-full text-sm"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (file.size > 280_000) {
                  toast.error("Ese archivo pesa más de 280 KB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setAttachments((list) => [...list, { id: newId(), name: file.name, dataUrl: String(reader.result) }]);
                };
                reader.readAsDataURL(file);
              }}
            />
          </Field>
          {attachments.map((file) => (
            <div key={file.id} className="mb-2 flex items-center justify-between gap-2 text-sm">
              <a className="truncate text-sage" href={file.dataUrl} download={file.name}>{file.name}</a>
              <button type="button" className="text-clay" onClick={() => setAttachments((list) => list.filter((f) => f.id !== file.id))}>Quitar</button>
            </div>
          ))}
        </>
      )}
      {existing ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Btn variant="soft" onClick={() => { setStatus(existing.id, existing.status === "hecha" ? "pendiente" : "hecha"); onClose(); }}>
            {existing.status === "hecha" ? "Reabrir" : "Marcar hecha"}
          </Btn>
          <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn>
        </div>
      ) : null}
    </Panel>
  );
}

function ExamForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.exams.find((e) => e.id === id));
  const upsert = useLife((s) => s.upsertExam);
  const remove = useLife((s) => s.deleteExam);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [subjectId, setSubjectId] = useState(existing?.subjectId ?? "");
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "");
  const [topics, setTopics] = useState(existing?.topics ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [offsets, setOffsets] = useState<number[]>(existing?.reminderOffsets ?? [1440]);
  return (
    <Panel
      title={existing ? "Examen" : "Nuevo examen"}
      onClose={onClose}
      footer={
        <Btn className="w-full" onClick={() => {
          if (!title.trim() || !date) return;
          upsert(blankExam({ ...existing, id: existing?.id ?? newId(), title: title.trim(), subjectId: subjectId || undefined, date, time: time || undefined, topics, notes, reminderOffsets: offsets }));
          onClose();
        }}>Guardar</Btn>
      }
    >
      <Field label="Nombre"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Materia"><SubjectSelect value={subjectId} onChange={setSubjectId} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Fecha"><input className={fieldClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Hora"><input className={fieldClass} type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      </div>
      <Field label="Temas"><textarea className={`${fieldClass} py-3`} rows={3} value={topics} onChange={(e) => setTopics(e.target.value)} /></Field>
      <Field label="Notas"><textarea className={`${fieldClass} py-3`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <p className="mb-1 text-sm text-ink-soft">Recordatorios</p>
      <Offsets value={offsets} onChange={setOffsets} />
      {existing ? <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}

function EventForm({ editor, onClose }: { editor: Extract<Editor, { kind: "evento" }>; onClose: () => void }) {
  const existing = useLife((s) => s.snap.events.find((e) => e.id === editor.id));
  const upsert = useLife((s) => s.upsertEvent);
  const override = useLife((s) => s.overrideEventOn);
  const occurrence = editor.scope === "dia" && editor.date && existing ? eventView(existing, editor.date) : null;
  const [title, setTitle] = useState(occurrence?.title ?? existing?.title ?? (editor.date && !editor.id ? "Recordatorio" : ""));
  const [date, setDate] = useState(editor.date ?? existing?.date ?? todayISO());
  const [time, setTime] = useState(occurrence?.time ?? existing?.time ?? "");
  const [endTime, setEndTime] = useState(occurrence?.endTime ?? existing?.endTime ?? "");
  const [description, setDescription] = useState(occurrence?.description ?? existing?.description ?? "");
  const [category, setCategory] = useState(occurrence?.category ?? existing?.category ?? (editor.date && !editor.id ? "Recordatorio" : "Personal"));
  const [importance, setImportance] = useState<Importance>(occurrence?.importance ?? existing?.importance ?? "media");
  const [offsets, setOffsets] = useState<number[]>(existing?.reminderOffsets ?? (category === "Recordatorio" ? [0] : []));
  const [freq, setFreq] = useState<"none" | "daily" | "weekly" | "monthly">(existing?.recurrence?.freq ?? "none");
  const [interval, setInterval] = useState(String(existing?.recurrence?.interval ?? 1));
  const [days, setDays] = useState<number[]>(existing?.recurrence?.days ?? []);
  const [until, setUntil] = useState(existing?.recurrence?.until ?? "");
  const oneDay = editor.scope === "dia" && existing && editor.date;
  return (
    <Panel
      title={oneDay ? "Solo este día" : existing ? "Evento" : "Nuevo evento"}
      onClose={onClose}
      footer={
        <Btn className="w-full" onClick={() => {
          if (!title.trim() || !date) return;
          if (oneDay && existing && editor.date) {
            override(existing.id, editor.date, {
              date: editor.date,
              type: "override",
              title: title.trim(),
              time: time || undefined,
              endTime: endTime || undefined,
              description,
              category,
              importance,
            });
            onClose();
            return;
          }
          upsert(blankEvent({
            ...existing,
            id: existing?.id ?? newId(),
            title: title.trim(),
            date,
            time: time || undefined,
            endTime: endTime || undefined,
            description,
            category,
            importance,
            reminderOffsets: offsets,
            recurrence: freq === "none" ? null : {
              freq,
              interval: Math.max(1, Number(interval) || 1),
              days: freq === "weekly" ? days : [],
              until: until || undefined,
            },
            exceptions: existing?.exceptions ?? [],
          }));
          onClose();
        }}>Guardar</Btn>
      }
    >
      {oneDay ? <p className="mb-3 text-sm text-ink-soft">La serie queda igual. Esto cambia únicamente el {editor.date}.</p> : null}
      <Field label="Nombre"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      {!oneDay ? (
        <Field label="Fecha"><input className={fieldClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Empieza"><input className={fieldClass} type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        <Field label="Termina"><input className={fieldClass} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></Field>
      </div>
      <Field label="Categoría">
        <select className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)}>
          {["Personal", "Colegio", "Estudio", "Salud", "Deporte", "Recordatorio"].map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Importancia">
        <select className={fieldClass} value={importance} onChange={(e) => setImportance(e.target.value as Importance)}>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </Field>
      <Field label="Descripción"><textarea className={`${fieldClass} py-3`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <p className="mb-1 text-sm text-ink-soft">Recordatorios</p>
      <Offsets value={offsets} onChange={setOffsets} />
      {!oneDay ? (
        <>
          <Field label="Repetición">
            <select className={fieldClass} value={freq} onChange={(e) => setFreq(e.target.value as typeof freq)}>
              <option value="none">No se repite</option>
              <option value="daily">Todos los días</option>
              <option value="weekly">Por semana</option>
              <option value="monthly">Por mes</option>
            </select>
          </Field>
          {freq !== "none" ? (
            <Field label="Cada cuántos">
              <input className={fieldClass} inputMode="numeric" value={interval} onChange={(e) => setInterval(e.target.value.replace(/[^\d]/g, ""))} />
            </Field>
          ) : null}
          {freq === "weekly" ? <DayPicks value={days} onChange={setDays} /> : null}
          {freq !== "none" ? (
            <Field label="Hasta"><input className={fieldClass} type="date" value={until} onChange={(e) => setUntil(e.target.value)} /></Field>
          ) : null}
        </>
      ) : null}
    </Panel>
  );
}

function SubjectForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.subjects.find((x) => x.id === id));
  const upsert = useLife((s) => s.upsertSubject);
  const remove = useLife((s) => s.deleteSubject);
  const [name, setName] = useState(existing?.name ?? "");
  const [teacher, setTeacher] = useState(existing?.teacher ?? "");
  const [room, setRoom] = useState(existing?.room ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [tone, setTone] = useState<Tone>(existing?.tone ?? "sage");
  return (
    <Panel title={existing ? "Materia" : "Nueva materia"} onClose={onClose} footer={<Btn className="w-full" onClick={() => { if (!name.trim()) return; upsert(blankSubject({ ...existing, id: existing?.id ?? newId(), name: name.trim(), teacher, room, notes, tone })); onClose(); }}>Guardar</Btn>}>
      <Field label="Nombre"><input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="Profesor"><input className={fieldClass} value={teacher} onChange={(e) => setTeacher(e.target.value)} /></Field>
      <Field label="Aula"><input className={fieldClass} value={room} onChange={(e) => setRoom(e.target.value)} /></Field>
      <Field label="Color">
        <div className="grid grid-cols-3 gap-2">
          {(["sage", "clay", "ink"] as Tone[]).map((t) => (
            <button key={t} type="button" onClick={() => setTone(t)} className={`min-h-11 rounded-2xl capitalize ${tone === t ? "bg-sage text-paper" : "border border-line bg-card"}`}>{t === "sage" ? "Salvia" : t === "clay" ? "Arcilla" : "Tinta"}</button>
          ))}
        </div>
      </Field>
      <Field label="Notas"><textarea className={`${fieldClass} py-3`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      {existing ? <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar materia</Btn> : null}
    </Panel>
  );
}

function BlockForm({ id, date, onClose }: { id?: string; date?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.blocks.find((b) => b.id === id));
  const upsert = useLife((s) => s.upsertBlock);
  const remove = useLife((s) => s.deleteBlock);
  const cancel = useLife((s) => s.cancelBlockOn);
  const [subjectId, setSubjectId] = useState(existing?.subjectId ?? "");
  const [dayOfWeek, setDayOfWeek] = useState(existing?.dayOfWeek ?? 1);
  const [start, setStart] = useState(existing?.start ?? "07:10");
  const [end, setEnd] = useState(existing?.end ?? "08:00");
  const [room, setRoom] = useState(existing?.room ?? "");
  const [scope, setScope] = useState<"regular" | "once">(existing?.scope ?? "regular");
  const [onceDate, setOnceDate] = useState(existing?.date ?? date ?? todayISO());
  const save = (asOnce: boolean) => {
    if (!subjectId || start >= end) return;
    if (asOnce && existing && date) {
      const block: Block = {
        id: newId(),
        subjectId,
        dayOfWeek,
        start,
        end,
        room,
        scope: "once",
        date,
        replacesId: existing.scope === "regular" ? existing.id : undefined,
      };
      upsert(block);
      onClose();
      return;
    }
    upsert({
      id: existing?.id ?? newId(),
      subjectId,
      dayOfWeek,
      start,
      end,
      room,
      scope,
      date: scope === "once" ? onceDate : undefined,
      replacesId: existing?.replacesId,
      cancelOf: existing?.cancelOf,
    });
    onClose();
  };
  return (
    <Panel title="Horario" onClose={onClose} footer={<Btn className="w-full" onClick={() => save(false)}>Guardar</Btn>}>
      <Field label="Materia"><SubjectSelect value={subjectId} onChange={setSubjectId} /></Field>
      <Field label="Alcance">
        <select className={fieldClass} value={scope} onChange={(e) => setScope(e.target.value as "regular" | "once")}>
          <option value="regular">Todas las semanas</option>
          <option value="once">Solo una fecha</option>
        </select>
      </Field>
      {scope === "regular" ? (
        <Field label="Día">
          <select className={fieldClass} value={dayOfWeek} onChange={(e) => setDayOfWeek(Number(e.target.value))}>
            {DAYS.map((d) => <option key={d.d} value={d.d}>{d.l}</option>)}
          </select>
        </Field>
      ) : (
        <Field label="Fecha"><input className={fieldClass} type="date" value={onceDate} onChange={(e) => setOnceDate(e.target.value)} /></Field>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Field label="Desde"><input className={fieldClass} type="time" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="Hasta"><input className={fieldClass} type="time" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      <Field label="Aula"><input className={fieldClass} value={room} onChange={(e) => setRoom(e.target.value)} /></Field>
      {existing && date && existing.scope === "regular" ? (
        <div className="mt-2 grid gap-2">
          <Btn variant="soft" onClick={() => save(true)}>Cambiar solo este día</Btn>
          <Btn variant="ghost" onClick={() => { cancel(existing.id, date); onClose(); }}>Quitar solo este día</Btn>
        </div>
      ) : null}
      {existing ? <Btn className="mt-3" variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar del horario</Btn> : null}
    </Panel>
  );
}

function HabitForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.habits.find((h) => h.id === id));
  const upsert = useLife((s) => s.upsertHabit);
  const remove = useLife((s) => s.deleteHabit);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [kind, setKind] = useState<HabitFreq["kind"]>(existing?.freq.kind ?? "daily");
  const [days, setDays] = useState<number[]>(existing?.freq.kind === "daily" ? existing.freq.days : [1, 2, 3, 4, 5]);
  const [target, setTarget] = useState(existing && existing.freq.kind !== "daily" ? String(existing.freq.target) : "4");
  const [tone, setTone] = useState<Tone>(existing?.tone ?? "sage");
  return (
    <Panel title={existing ? "Hábito" : "Nuevo hábito"} onClose={onClose} footer={<Btn className="w-full" onClick={() => {
      if (!title.trim()) return;
      const freq: HabitFreq = kind === "daily" ? { kind, days } : { kind, target: Math.max(1, Number(target) || 1) };
      upsert(blankHabit({ ...existing, id: existing?.id ?? newId(), title: title.trim(), freq, tone }));
      onClose();
    }}>Guardar</Btn>}>
      <Field label="Nombre"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Frecuencia">
        <select className={fieldClass} value={kind} onChange={(e) => setKind(e.target.value as HabitFreq["kind"])}>
          <option value="daily">Días elegidos</option>
          <option value="weekly">Veces por semana</option>
          <option value="monthly">Veces por mes</option>
        </select>
      </Field>
      {kind === "daily" ? <DayPicks value={days} onChange={setDays} /> : (
        <Field label="Objetivo"><input className={fieldClass} inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ""))} /></Field>
      )}
      <p className="mb-3 text-sm text-ink-soft">Los días que no marcaste no cuentan como fallo.</p>
      <div className="grid grid-cols-3 gap-2">
        {(["sage", "clay", "ink"] as Tone[]).map((t) => (
          <button key={t} type="button" onClick={() => setTone(t)} className={`min-h-11 rounded-2xl ${tone === t ? "bg-sage text-paper" : "border border-line bg-card"}`}>{t === "sage" ? "Salvia" : t === "clay" ? "Arcilla" : "Tinta"}</button>
        ))}
      </div>
      {existing ? <Btn className="mt-4" variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}

function RoutineForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.routines.find((r) => r.id === id));
  const upsert = useLife((s) => s.upsertRoutine);
  const remove = useLife((s) => s.deleteRoutine);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [time, setTime] = useState(existing?.time ?? "07:00");
  const [duration, setDuration] = useState(String(existing?.durationMin ?? 20));
  const [days, setDays] = useState<number[]>(existing?.days ?? [1, 2, 3, 4, 5]);
  const [steps, setSteps] = useState(existing?.steps ?? []);
  const [step, setStep] = useState("");
  const [offsets, setOffsets] = useState<number[]>(existing?.reminderOffsets ?? [0]);
  return (
    <Panel title={existing ? "Rutina" : "Nueva rutina"} onClose={onClose} footer={<Btn className="w-full" onClick={() => {
      if (!title.trim()) return;
      upsert(blankRoutine({ ...existing, id: existing?.id ?? newId(), title: title.trim(), time, durationMin: Number(duration) || 20, days, steps, reminderOffsets: offsets, paused: existing?.paused ?? false }));
      onClose();
    }}>Guardar</Btn>}>
      <Field label="Nombre"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Hora"><input className={fieldClass} type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
        <Field label="Minutos"><input className={fieldClass} inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value.replace(/[^\d]/g, ""))} /></Field>
      </div>
      <p className="mb-1 text-sm text-ink-soft">Días</p>
      <DayPicks value={days} onChange={setDays} />
      <p className="mb-1 text-sm text-ink-soft">Aviso</p>
      <Offsets value={offsets} onChange={setOffsets} />
      <p className="mb-2 text-sm text-clay">Un aviso no es una alarma del reloj. Si el iPhone está bloqueado, LifeOS no puede garantizar que suene.</p>
      <p className="mb-2 text-sm text-ink-soft">Pasos</p>
      {steps.map((s, index) => (
        <div key={s.id} className="mb-2 flex gap-2">
          <input className={fieldClass} value={s.title} onChange={(e) => setSteps((list) => list.map((x) => x.id === s.id ? { ...x, title: e.target.value } : x))} />
          <button type="button" className="text-sm text-clay" onClick={() => setSteps((list) => list.filter((_, i) => i !== index))}>Quitar</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input className={fieldClass} value={step} placeholder="Nuevo paso" onChange={(e) => setStep(e.target.value)} />
        <Btn variant="soft" onClick={() => { if (!step.trim()) return; setSteps((list) => [...list, { id: newId(), title: step.trim() }]); setStep(""); }}>Sumar</Btn>
      </div>
      {existing ? <Btn className="mt-4" variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}

function NoteForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.notes.find((n) => n.id === id));
  const upsert = useLife((s) => s.upsertNote);
  const remove = useLife((s) => s.deleteNote);
  const subjects = useLife((s) => s.snap.subjects);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [tags, setTags] = useState(existing?.tags.join(", ") ?? "");
  const [link, setLink] = useState(existing?.links[0]?.id ?? "");
  return (
    <Panel title={existing ? "Nota" : "Nueva nota"} onClose={onClose} footer={<Btn className="w-full" onClick={() => {
      if (!title.trim() && !content.trim()) return;
      upsert(blankNote({
        ...existing,
        id: existing?.id ?? newId(),
        title: title.trim(),
        content,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        links: link ? [{ kind: "materia", id: link }] : [],
      }));
      onClose();
    }}>Guardar</Btn>}>
      <Field label="Título"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Nota"><textarea className={`${fieldClass} py-3`} rows={6} value={content} onChange={(e) => setContent(e.target.value)} /></Field>
      <Field label="Categoría"><input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
      <Field label="Etiquetas, separadas por coma"><input className={fieldClass} value={tags} onChange={(e) => setTags(e.target.value)} /></Field>
      <Field label="Vincular a una materia">
        <select className={fieldClass} value={link} onChange={(e) => setLink(e.target.value)}>
          <option value="">Sin vínculo</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Field>
      {existing ? <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}

function InboxForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.inbox.find((i) => i.id === id));
  const upsert = useLife((s) => s.upsertInbox);
  const remove = useLife((s) => s.deleteInbox);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  return (
    <Panel title={existing ? "Pendiente" : "Nuevo pendiente"} onClose={onClose} footer={<Btn className="w-full" onClick={() => {
      if (!title.trim()) return;
      upsert(blankInbox({ ...existing, id: existing?.id ?? newId(), title: title.trim(), notes, category, archived: existing?.archived ?? false }));
      onClose();
    }}>Guardar</Btn>}>
      <Field label="Qué se te ocurrió"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Notas"><textarea className={`${fieldClass} py-3`} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
      <Field label="Categoría"><input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
      {existing ? <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}

function SessionForm({ id, onClose }: { id?: string; onClose: () => void }) {
  const existing = useLife((s) => s.snap.sessions.find((s) => s.id === id));
  const tasks = useLife((s) => s.snap.tasks);
  const exams = useLife((s) => s.snap.exams);
  const upsert = useLife((s) => s.upsertSession);
  const remove = useLife((s) => s.deleteSession);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [date, setDate] = useState(existing?.date ?? todayISO());
  const [start, setStart] = useState(existing?.start ?? "16:00");
  const [minutes, setMinutes] = useState(String(existing?.plannedMinutes ?? 40));
  const [taskId, setTaskId] = useState(existing?.taskId ?? "");
  const [examId, setExamId] = useState(existing?.examId ?? "");
  return (
    <Panel title={existing ? "Sesión" : "Sesión de estudio"} onClose={onClose} footer={<Btn className="w-full" onClick={() => {
      if (!title.trim() || !date) return;
      upsert(blankSession({
        ...existing,
        id: existing?.id ?? newId(),
        title: title.trim(),
        date,
        start: start || undefined,
        plannedMinutes: Number(minutes) || 25,
        taskId: taskId || undefined,
        examId: examId || undefined,
        subjectId: tasks.find((t) => t.id === taskId)?.subjectId || exams.find((e) => e.id === examId)?.subjectId,
        status: existing?.status ?? "planificada",
        focusMinutes: existing?.focusMinutes ?? 0,
      }));
      onClose();
    }}>Guardar</Btn>}>
      <Field label="Título"><input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Día"><input className={fieldClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Hora"><input className={fieldClass} type="time" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
      </div>
      <Field label="Minutos"><input className={fieldClass} inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value.replace(/[^\d]/g, ""))} /></Field>
      <Field label="Tarea">
        <select className={fieldClass} value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">Ninguna</option>
          {tasks.filter((t) => t.status === "pendiente").map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </Field>
      <Field label="Examen">
        <select className={fieldClass} value={examId} onChange={(e) => setExamId(e.target.value)}>
          <option value="">Ninguno</option>
          {exams.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
      </Field>
      {existing ? <Btn variant="ghost" onClick={() => { remove(existing.id); onClose(); }}>Eliminar</Btn> : null}
    </Panel>
  );
}
