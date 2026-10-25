import { useEffect, useState } from "react";
import { Calendar, Ellipsis, GraduationCap, House, Leaf, Plus } from "lucide-react";
import { Toaster } from "sonner";
import { useLife } from "@/lib/life/store";
import { VIEW_IDS, type ViewId } from "@/lib/life/types";
import { Agenda } from "./agenda";
import { Extra } from "./extra";
import { EditorHost, type Editor } from "./forms";
import { School } from "./school";
import { Today } from "./today";
import { Vida } from "./vida";

const NAV: { id: ViewId; label: string; icon: typeof House }[] = [
  { id: "hoy", label: "Hoy", icon: House },
  { id: "colegio", label: "Colegio", icon: GraduationCap },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "vida", label: "Vida", icon: Leaf },
  { id: "mas", label: "Más", icon: Ellipsis },
];

function readView(): ViewId {
  if (typeof window === "undefined") return "hoy";
  const id = window.location.hash.replace("#", "") as ViewId;
  return VIEW_IDS.includes(id) ? id : "hoy";
}

export function LifeApp() {
  const ready = useLife((s) => s.ready);
  const init = useLife((s) => s.init);
  const theme = useLife((s) => s.snap.prefs.theme);
  const notice = useLife((s) => s.snap.notices[0]);
  const dismiss = useLife((s) => s.dismissNotice);
  const [view, setView] = useState<ViewId>("hoy");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "claro") root.classList.add("light");
    if (theme === "oscuro") root.classList.add("dark");
  }, [theme]);

  useEffect(() => {
    const apply = () => setView(readView());
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const flush = () => useLife.getState().flushReminders();
    flush();
    const id = window.setInterval(flush, 30000);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let gone = false;
    const onController = () => {
      if (sessionStorage.getItem("lifeos-update") === "1") {
        sessionStorage.removeItem("lifeos-update");
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", onController);
    void navigator.serviceWorker.register("/lifeos-sw.js").then((reg) => {
      const look = () => {
        if (!gone && reg.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
      };
      reg.addEventListener("updatefound", () => {
        reg.installing?.addEventListener("statechange", look);
      });
      void reg.update().catch(() => undefined);
      look();
    });
    return () => {
      gone = true;
      navigator.serviceWorker.removeEventListener("controllerchange", onController);
    };
  }, []);

  const go = (next: ViewId) => {
    setView(next);
    const url = `${window.location.pathname}${window.location.search}#${next}`;
    window.history.replaceState(null, "", url);
  };

  const showFab = ["hoy", "colegio", "agenda", "vida", "pendientes", "notas"].includes(view);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto min-h-screen w-full max-w-lg md:border-x md:border-line">
        {!ready ? (
          <div className="flex min-h-screen flex-col justify-end px-6 pb-safe pt-safe">
            <p className="font-display text-5xl leading-none">LifeOS</p>
            <p className="mt-3 text-ink-soft">Tu día, en orden.</p>
          </div>
        ) : (
          <>
            {updateReady ? (
              <div className="px-4 pt-safe">
                <button
                  type="button"
                  className="mt-2 w-full rounded-2xl bg-sage px-4 py-3 text-left text-paper"
                  onClick={() => {
                    sessionStorage.setItem("lifeos-update", "1");
                    void navigator.serviceWorker.getRegistration().then((reg) => reg?.waiting?.postMessage("skip-waiting"));
                  }}
                >
                  Hay una versión nueva. Tocá para aplicarla sin reinstalar.
                </button>
              </div>
            ) : null}
            {notice ? (
              <div className={`px-4 ${updateReady ? "pt-2" : "pt-safe"}`}>
                <button type="button" className="mt-2 w-full rounded-2xl bg-clay-soft px-4 py-3 text-left" onClick={() => { go(notice.view); dismiss(notice.id); }}>
                  <span className="block text-sm text-ink-soft">Aviso con la app abierta</span>
                  <span className="block">{notice.body}</span>
                </button>
              </div>
            ) : null}
            <main className={`px-4 pb-nav ${notice || updateReady ? "pt-4" : "pt-safe"}`}>
              {view === "hoy" ? <Today onOpen={setEditor} go={go} /> : null}
              {view === "colegio" ? <School onOpen={setEditor} /> : null}
              {view === "agenda" ? <Agenda onOpen={setEditor} /> : null}
              {view === "vida" ? <Vida onOpen={setEditor} /> : null}
              {view !== "hoy" && view !== "colegio" && view !== "agenda" && view !== "vida" ? (
                <Extra view={view} go={go} onOpen={setEditor} />
              ) : null}
            </main>
            {showFab ? (
              <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.6rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-full max-w-lg justify-end px-4">
                <button type="button" aria-label="Nueva actividad" onClick={() => setEditor({ kind: "rapido" })} className="pointer-events-auto grid size-14 place-items-center rounded-full bg-sage text-paper">
                  <Plus className="size-6" />
                </button>
              </div>
            ) : null}
            <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-center" aria-label="Principal">
              <div className="flex w-full max-w-lg border-t border-line bg-paper pb-[max(0.25rem,env(safe-area-inset-bottom))]">
                {NAV.map((item) => {
                  const on = view === item.id || (item.id === "mas" && !["hoy", "colegio", "agenda", "vida"].includes(view));
                  const Icon = item.icon;
                  return (
                    <button key={item.id} type="button" onClick={() => go(item.id)} className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs ${on ? "text-sage" : "text-ink-soft"}`} aria-current={on ? "page" : undefined}>
                      <Icon className="size-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </>
        )}
      </div>
      {editor ? <EditorHost editor={editor} onClose={() => setEditor(null)} onOpen={setEditor} /> : null}
      <Toaster position="top-center" />
    </div>
  );
}
