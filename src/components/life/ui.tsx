import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check, X } from "lucide-react";
import type { Tone } from "@/lib/life/types";

export const fieldClass =
  "min-h-12 w-full rounded-2xl border border-line bg-card px-3 text-base text-ink outline-none";

export function Panel({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-ink/40" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-full w-full max-w-lg flex-col bg-paper text-ink">
        <header className="flex items-center gap-2 border-b border-line bg-paper px-3 pt-safe pb-2">
          <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full" aria-label="Cerrar">
            <X className="size-5" />
          </button>
          <h2 className="font-display text-2xl leading-none">{title}</h2>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? <footer className="border-t border-line px-4 pt-3 pb-safe">{footer}</footer> : null}
      </div>
    </div>
  );
}

export function Btn({
  variant = "solid",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "clay" | "soft" }) {
  const look = {
    solid: "bg-sage text-paper",
    ghost: "bg-transparent text-ink",
    clay: "bg-clay text-paper",
    soft: "bg-sage-soft text-sage",
  }[variant];
  return (
    <button
      type="button"
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-medium transition-transform active:scale-[0.98] disabled:opacity-50 ${look} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-sm text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl leading-none">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-card px-4 py-5">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{body}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-line bg-card p-3 ${className}`}>{children}</div>;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="mb-4 flex gap-1 rounded-2xl bg-line/70 p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`min-h-10 flex-1 rounded-xl px-2 text-sm font-medium ${value === opt.id ? "bg-card text-ink" : "text-ink-soft"}`}
          aria-pressed={value === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function toneClass(tone: Tone): string {
  if (tone === "sage") return "bg-sage-soft text-sage";
  if (tone === "clay") return "bg-clay-soft text-clay";
  return "bg-line text-ink";
}

export function CheckButton({
  done,
  label,
  onClick,
}: {
  done: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-11 shrink-0 place-items-center rounded-full border ${done ? "border-sage bg-sage text-paper" : "border-line bg-card text-transparent"}`}
    >
      <Check className="size-4" strokeWidth={2.5} />
    </button>
  );
}
