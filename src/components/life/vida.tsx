import { useState } from "react";
import { todayISO } from "@/lib/life/dates";
import { habitMark, habitStreak, periodCount, routineLog } from "@/lib/life/logic";
import { useLife } from "@/lib/life/store";
import type { HabitMark } from "@/lib/life/types";
import type { Editor } from "./forms";
import { Btn, Card, Empty, Section, Segmented } from "./ui";

export function Vida({ onOpen }: { onOpen: (editor: Editor) => void }) {
  const snap = useLife((s) => s.snap);
  const mark = useLife((s) => s.markHabit);
  const togglePause = useLife((s) => s.toggleRoutinePause);
  const toggleStep = useLife((s) => s.toggleStep);
  const [tab, setTab] = useState<"habitos" | "rutinas">("habitos");
  const today = todayISO();

  return (
    <div>
      <h1 className="mb-4 font-display text-4xl leading-none">Vida</h1>
      <Segmented value={tab} onChange={setTab} options={[{ id: "habitos", label: "Hábitos" }, { id: "rutinas", label: "Rutinas" }]} />
      {tab === "habitos" ? (
        <>
          <div className="mb-3"><Btn onClick={() => onOpen({ kind: "habito" })}>Nuevo hábito</Btn></div>
          {snap.habits.length === 0 ? <Empty title="Sin hábitos" body="Podés pedir cuatro veces por semana, o solo algunos días. El resto no se cuenta como falta." /> : (
            <div className="grid gap-3">
              {snap.habits.map((habit) => {
                const current = habitMark(snap.habitLogs, habit.id, today);
                const count = periodCount(habit, snap.habitLogs, today);
                const streak = habitStreak(habit, snap.habitLogs, today);
                const set = (next: HabitMark | null) => mark(habit.id, today, current === next ? null : next);
                return (
                  <Card key={habit.id}>
                    <button type="button" className="w-full text-left" onClick={() => onOpen({ kind: "habito", id: habit.id })}>
                      <p className="font-medium">{habit.title}</p>
                      <p className="text-sm text-ink-soft">
                        {habit.freq.kind === "daily" ? "Días elegidos" : `${count.done} de ${count.target}`}
                        {streak ? ` · racha ${streak}` : ""}
                      </p>
                    </button>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Mark label="Hecho" on={current === "hecho"} onClick={() => set("hecho")} />
                      <Mark label="Omitir" on={current === "omitido"} onClick={() => set("omitido")} />
                      <Mark label="No aplica" on={current === "na"} onClick={() => set("na")} />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-3"><Btn onClick={() => onOpen({ kind: "rutina" })}>Nueva rutina</Btn></div>
          <p className="mb-3 text-sm text-ink-soft">El aviso llega si LifeOS está abierta o si el sistema lo permite. No reemplaza la alarma del iPhone.</p>
          {snap.routines.length === 0 ? <Empty title="Sin rutinas" body="Una rutina es una lista de pasos con hora y días." /> : snap.routines.map((routine) => {
            const log = routineLog(snap.routineLogs, routine.id, today);
            return (
              <Section key={routine.id} title={routine.title} action={<button type="button" className="text-sm text-sage" onClick={() => onOpen({ kind: "rutina", id: routine.id })}>Editar</button>}>
                <p className="mb-2 text-sm text-ink-soft">{routine.time} · {routine.durationMin} min {routine.paused ? "· en pausa" : ""}</p>
                <div className="mb-2 flex gap-2">
                  <Btn variant="soft" className="min-h-10" onClick={() => togglePause(routine.id)}>{routine.paused ? "Reanudar" : "Pausar"}</Btn>
                </div>
                {routine.steps.map((step) => {
                  const done = log?.doneSteps.includes(step.id) ?? false;
                  return (
                    <button key={step.id} type="button" className="flex min-h-11 w-full items-center gap-3 text-left" onClick={() => toggleStep(routine.id, today, step.id)}>
                      <span className={`size-4 rounded-full border ${done ? "bg-sage border-sage" : "border-line"}`} />
                      {step.title}
                    </button>
                  );
                })}
              </Section>
            );
          })}
        </>
      )}
    </div>
  );
}

function Mark({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`min-h-11 rounded-2xl text-sm ${on ? "bg-sage text-paper" : "border border-line bg-card"}`} aria-pressed={on}>
      {label}
    </button>
  );
}
