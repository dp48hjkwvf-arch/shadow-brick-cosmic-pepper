import { useState } from "react";
import { addDays, prettyShort, startOfWeek, todayISO, WEEKDAY_NAME } from "@/lib/life/dates";
import { classesOn, subjectName, urgencyOf } from "@/lib/life/logic";
import { useLife } from "@/lib/life/store";
import type { Editor } from "./forms";
import { Btn, Card, CheckButton, Empty, Section, Segmented, toneClass } from "./ui";

export function School({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const snap = useLife((s) => s.snap);
  const setStatus = useLife((s) => s.setTaskStatus);
  const [tab, setTab] = useState<"horario" | "tareas" | "examenes" | "materias">("horario");
  const [filter, setFilter] = useState<"pendientes" | "hechas" | "todas">("pendientes");
  const today = todayISO();
  const [day, setDay] = useState(today);
  const week = startOfWeek(today);

  const tasks = snap.tasks.filter((t) => (filter === "todas" ? true : filter === "hechas" ? t.status === "hecha" : t.status === "pendiente"));

  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Colegio</h1>
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { id: "horario", label: "Horario" },
          { id: "tareas", label: "Tareas" },
          { id: "examenes", label: "Exámenes" },
          { id: "materias", label: "Materias" },
        ]}
      />
      {tab === "horario" ? (
        <>
          <div className="mb-3 flex gap-1 overflow-x-auto">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(week, i);
              const on = date === day;
              return (
                <button key={date} type="button" onClick={() => setDay(date)} className={`min-h-14 min-w-12 rounded-2xl px-2 ${on ? "bg-sage text-paper" : "bg-card border border-line"}`}>
                  <span className="block text-xs">{WEEKDAY_NAME[new Date(`${date}T12:00:00`).getDay()]?.slice(0, 2)}</span>
                  <span className="tabular-nums">{date.slice(8)}</span>
                </button>
              );
            })}
          </div>
          <Section title={day === today ? "Hoy" : prettyShort(day)} action={<Btn variant="soft" className="min-h-10 px-3" onClick={() => onOpen({ kind: "bloque", date: day })}>Agregar</Btn>}>
            {classesOn(snap.blocks, day).length === 0 ? (
              <Empty title="Sin clases" body="Este día no tiene horario. Podés sumar un bloque o un cambio temporal." />
            ) : (
              <div className="grid gap-2">
                {classesOn(snap.blocks, day).map((block) => {
                  const subject = snap.subjects.find((s) => s.id === block.subjectId);
                  return (
                    <button key={block.id} type="button" className="text-left" onClick={() => onOpen({ kind: "bloque", id: block.id, date: day })}>
                      <Card className="flex gap-3">
                        <span className={`mt-1 h-10 w-1.5 rounded-full ${subject?.tone === "clay" ? "bg-clay" : subject?.tone === "ink" ? "bg-ink" : "bg-sage"}`} />
                        <span>
                          <span className="block font-medium">{subject?.name ?? "Clase"}</span>
                          <span className="block text-sm text-ink-soft">
                            {block.start}–{block.end}
                            {block.scope === "once" ? " · cambio de este día" : ""}
                            {block.room ? ` · ${block.room}` : ""}
                          </span>
                        </span>
                      </Card>
                    </button>
                  );
                })}
              </div>
            )}
          </Section>
        </>
      ) : null}
      {tab === "tareas" ? (
        <>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { id: "pendientes", label: "Pendientes" },
              { id: "hechas", label: "Hechas" },
              { id: "todas", label: "Todas" },
            ]}
          />
          <div className="mb-3"><Btn onClick={() => onOpen({ kind: "tarea" })}>Nueva tarea</Btn></div>
          {tasks.length === 0 ? <Empty title="No hay tareas acá" body="Las que cargues se guardan en este teléfono." /> : (
            <div className="grid gap-2">
              {tasks.map((task) => (
                <Card key={task.id} className="flex items-center gap-2">
                  <CheckButton done={task.status === "hecha"} label={`Estado de ${task.title}`} onClick={() => setStatus(task.id, task.status === "hecha" ? "pendiente" : "hecha")} />
                  <button type="button" className="min-h-11 flex-1 text-left" onClick={() => onOpen({ kind: "tarea", id: task.id })}>
                    <span className="block font-medium">{task.title}</span>
                    <span className="block text-sm text-ink-soft">
                      {subjectName(snap, task.subjectId) || "Personal"}
                      {task.dueDate ? ` · ${prettyShort(task.dueDate)}` : ""}
                      {task.status === "pendiente" ? ` · ${urgencyOf(task, today).replace("-", " ")}` : task.status === "cancelada" ? " · cancelada" : ""}
                    </span>
                  </button>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : null}
      {tab === "examenes" ? (
        <>
          <div className="mb-3"><Btn onClick={() => onOpen({ kind: "examen" })}>Nuevo examen</Btn></div>
          {snap.exams.length === 0 ? <Empty title="Sin exámenes" body="Cuando agregues uno, vas a poder armar sesiones de estudio." /> : (
            <div className="grid gap-2">
              {snap.exams.map((exam) => (
                <button key={exam.id} type="button" className="text-left" onClick={() => onOpen({ kind: "examen", id: exam.id })}>
                  <Card>
                    <p className={`mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(snap.subjects.find((s) => s.id === exam.subjectId)?.tone ?? "clay")}`}>{subjectName(snap, exam.subjectId) || "Examen"}</p>
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-ink-soft">{prettyShort(exam.date)}{exam.time ? ` · ${exam.time}` : ""}</p>
                    {exam.topics ? <p className="mt-1 text-sm">{exam.topics}</p> : null}
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      ) : null}
      {tab === "materias" ? (
        <>
          <div className="mb-3"><Btn onClick={() => onOpen({ kind: "materia" })}>Nueva materia</Btn></div>
          {snap.subjects.length === 0 ? <Empty title="Todavía no hay materias" body="Sumá la primera y después armá el horario." /> : (
            <div className="grid gap-2">
              {snap.subjects.map((subject) => (
                <button key={subject.id} type="button" className="text-left" onClick={() => onOpen({ kind: "materia", id: subject.id })}>
                  <Card>
                    <p className={`mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(subject.tone)}`}>{subject.room || "Sin aula"}</p>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-sm text-ink-soft">{subject.teacher || "Sin profesor"}</p>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
