import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { K as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as CalendarRange, a as StickyNote, c as Plus, d as House, f as GraduationCap, g as Calendar, h as ChartColumn, i as Sunrise, l as Leaf, m as Check, o as Settings, p as Ellipsis, r as Timer, s as Search, t as X, u as Inbox, v as BookOpen, y as Bell } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as format, t as es } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bw7mUyLN.js
var routes_Bw7mUyLN_exports = /* @__PURE__ */ __exportAll({
	component: () => Home,
	i: () => showLocalNotice,
	n: () => isStandalone,
	r: () => notificationsSupported,
	t: () => isIos
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isIos() {
	if (typeof navigator === "undefined") return false;
	return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
function isStandalone() {
	if (typeof window === "undefined") return false;
	const nav = navigator;
	return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}
function notificationsSupported() {
	return typeof window !== "undefined" && "Notification" in window;
}
async function showLocalNotice(title, body, view, tag) {
	if (!notificationsSupported() || Notification.permission !== "granted") return;
	try {
		const reg = await navigator.serviceWorker?.getRegistration();
		if (reg) {
			await reg.showNotification(title, {
				body,
				tag,
				icon: "/favicon.svg",
				data: { view }
			});
			return;
		}
	} catch {}
	try {
		const n = new Notification(title, {
			body,
			tag
		});
		n.onclick = () => {
			window.focus();
			window.location.hash = view;
		};
	} catch {}
}
function todayISO(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function parseDay(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	return new Date(y || 1970, (m || 1) - 1, d || 1);
}
function addDays(iso, n) {
	const d = parseDay(iso);
	d.setDate(d.getDate() + n);
	return todayISO(d);
}
function diffDays(a, b) {
	return Math.round((parseDay(a).getTime() - parseDay(b).getTime()) / 864e5);
}
function dow(iso) {
	return parseDay(iso).getDay();
}
function startOfWeek(iso) {
	const day = dow(iso);
	return addDays(iso, day === 0 ? -6 : 1 - day);
}
function startOfMonth(iso) {
	const d = parseDay(iso);
	return todayISO(new Date(d.getFullYear(), d.getMonth(), 1));
}
function daysInMonth(iso) {
	const d = parseDay(iso);
	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function timeToMin(t) {
	const [h, m] = t.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
}
function minToTime(mins) {
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function nowTime(d = /* @__PURE__ */ new Date()) {
	return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function combine(date, time = "08:00") {
	const d = parseDay(date);
	const [h, m] = time.split(":").map(Number);
	d.setHours(h || 0, m || 0, 0, 0);
	return d;
}
function overlaps(a0, a1, b0, b1) {
	return a0 < b1 && b0 < a1;
}
function cap(s) {
	if (!s) return s;
	return s.charAt(0).toLocaleUpperCase("es") + s.slice(1);
}
function prettyDate(iso) {
	return cap(format(parseDay(iso), "EEEE d 'de' MMMM", { locale: es }));
}
function prettyShort(iso) {
	return format(parseDay(iso), "d MMM", { locale: es });
}
var WEEKDAY_NAME = [
	"domingo",
	"lunes",
	"martes",
	"miércoles",
	"jueves",
	"viernes",
	"sábado"
];
function isoWeekKey(iso) {
	return startOfWeek(iso);
}
function monthKey(iso) {
	return iso.slice(0, 7);
}
function newId() {
	return crypto.randomUUID();
}
function blankSubject(partial = {}) {
	return {
		id: newId(),
		name: "",
		teacher: "",
		room: "",
		tone: "sage",
		notes: "",
		...partial
	};
}
function blankTask(partial = {}) {
	return {
		id: newId(),
		title: "",
		description: "",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		importance: "media",
		urgencyMode: "auto",
		status: "pendiente",
		subtasks: [],
		notes: "",
		attachments: [],
		reminderOffsets: [],
		pinned: false,
		...partial
	};
}
function blankExam(partial = {}) {
	return {
		id: newId(),
		title: "",
		date: "",
		topics: "",
		notes: "",
		reminderOffsets: [1440],
		...partial
	};
}
function blankEvent(partial = {}) {
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
		...partial
	};
}
function blankRoutine(partial = {}) {
	return {
		id: newId(),
		title: "",
		time: "07:00",
		durationMin: 20,
		days: [
			1,
			2,
			3,
			4,
			5
		],
		steps: [],
		paused: false,
		reminderOffsets: [0],
		...partial
	};
}
function blankHabit(partial = {}) {
	return {
		id: newId(),
		title: "",
		freq: {
			kind: "daily",
			days: [
				1,
				2,
				3,
				4,
				5,
				6,
				0
			]
		},
		tone: "sage",
		...partial
	};
}
function blankNote(partial = {}) {
	return {
		id: newId(),
		title: "",
		content: "",
		category: "",
		tags: [],
		links: [],
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...partial
	};
}
function blankSession(partial = {}) {
	return {
		id: newId(),
		title: "",
		date: "",
		plannedMinutes: 25,
		focusMinutes: 0,
		status: "planificada",
		...partial
	};
}
function blankInbox(partial = {}) {
	return {
		id: newId(),
		title: "",
		notes: "",
		category: "",
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		archived: false,
		...partial
	};
}
function emptySnapshot() {
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
			{
				id: "bp-mochila",
				label: "Mochila"
			},
			{
				id: "bp-cuadernos",
				label: "Cuadernos y tareas"
			},
			{
				id: "bp-utiles",
				label: "Útiles"
			},
			{
				id: "bp-agua",
				label: "Botella de agua"
			}
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
			installHintDismissed: false
		},
		focus: null
	};
}
var DB_NAME = "lifeos";
var STORE = "kv";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("No se pudo abrir la base local"));
	});
}
async function idbGet(key) {
	const db = await openDb();
	try {
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("Lectura fallida"));
		});
	} finally {
		db.close();
	}
}
async function idbSet(key, value) {
	const db = await openDb();
	try {
		await new Promise((resolve, reject) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(value, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("Escritura fallida"));
		});
	} finally {
		db.close();
	}
}
function subjectById(snap, id) {
	if (!id) return void 0;
	return snap.subjects.find((s) => s.id === id);
}
function subjectName(snap, id) {
	return subjectById(snap, id)?.name ?? "";
}
function classesOn(blocks, date) {
	const day = dow(date);
	const once = blocks.filter((b) => b.scope === "once" && b.date === date);
	const cancelled = new Set(once.map((b) => b.cancelOf).filter(Boolean));
	const replaced = new Set(once.map((b) => b.replacesId).filter(Boolean));
	return [...blocks.filter((b) => b.scope === "regular" && b.dayOfWeek === day && !cancelled.has(b.id) && !replaced.has(b.id)), ...once.filter((b) => !b.cancelOf)].sort((a, b) => a.start.localeCompare(b.start));
}
function eventOccursOn(ev, date) {
	if (ev.exceptions.some((e) => e.date === date && e.type === "skip")) return false;
	if (!ev.recurrence) return ev.date === date;
	const rec = ev.recurrence;
	if (date < ev.date) return false;
	if (rec.until && date > rec.until) return false;
	const interval = Math.max(1, rec.interval || 1);
	if (rec.freq === "daily") return diffDays(date, ev.date) % interval === 0;
	if (rec.freq === "weekly") {
		if (!(rec.days.length ? rec.days : [dow(ev.date)]).includes(dow(date))) return false;
		const weeks = Math.round(diffDays(startOfWeek(date), startOfWeek(ev.date)) / 7);
		return weeks >= 0 && weeks % interval === 0;
	}
	const start = ev.date;
	if (date.slice(8, 10) !== start.slice(8, 10)) return false;
	const months = (Number(date.slice(0, 4)) - Number(start.slice(0, 4))) * 12 + (Number(date.slice(5, 7)) - Number(start.slice(5, 7)));
	return months >= 0 && months % interval === 0;
}
function eventView(ev, date) {
	const hit = ev.exceptions.find((e) => e.date === date && e.type === "override");
	return {
		title: hit?.title || ev.title,
		time: hit?.time ?? ev.time,
		endTime: hit?.endTime ?? ev.endTime,
		description: hit?.description ?? ev.description,
		category: hit?.category || ev.category,
		importance: hit?.importance || ev.importance
	};
}
function endFrom(start, minutes) {
	if (!start) return void 0;
	return minToTime(timeToMin(start) + minutes);
}
function agendaOn(snap, date) {
	const items = [];
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
			tone: subject?.tone ?? "ink"
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
			end: task.dueTime ? endFrom(task.dueTime, 15) : void 0,
			title: task.title,
			detail: task.status === "hecha" ? "Entregada" : "Entrega",
			tone: subjectById(snap, task.subjectId)?.tone ?? "clay",
			importance: task.importance
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
			end: exam.time ? endFrom(exam.time, 80) : void 0,
			title: exam.title,
			detail: subjectName(snap, exam.subjectId) || "Examen",
			tone: subjectById(snap, exam.subjectId)?.tone ?? "clay",
			importance: "alta"
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
			end: view.endTime || (view.time ? endFrom(view.time, 60) : void 0),
			title: view.title,
			detail: view.category,
			tone: "ink",
			importance: view.importance
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
			tone: "sage"
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
			end: session.start ? endFrom(session.start, session.plannedMinutes || 30) : void 0,
			title: session.title,
			detail: session.status === "completada" ? "Estudio hecho" : "Sesión de estudio",
			tone: "sage"
		});
	}
	return items.sort((a, b) => (a.start ?? "99:99").localeCompare(b.start ?? "99:99") || a.title.localeCompare(b.title));
}
function conflictsOn(items) {
	const map = /* @__PURE__ */ new Map();
	const timed = items.filter((i) => i.start && i.end && i.source !== "tarea");
	for (let i = 0; i < timed.length; i++) for (let j = i + 1; j < timed.length; j++) {
		const a = timed[i];
		const b = timed[j];
		if (!a || !b || !a.start || !a.end || !b.start || !b.end) continue;
		if (!overlaps(timeToMin(a.start), timeToMin(a.end), timeToMin(b.start), timeToMin(b.end))) continue;
		map.set(a.key, [...map.get(a.key) ?? [], b.title]);
		map.set(b.key, [...map.get(b.key) ?? [], a.title]);
	}
	return map;
}
function urgencyOf(task, today) {
	if (task.urgencyMode !== "auto") return task.urgencyMode;
	if (!task.dueDate) return "sin-apuro";
	const d = diffDays(task.dueDate, today);
	if (d < 0) return "vencida";
	if (d === 0) return "hoy";
	if (d <= 3) return "proxima";
	return "sin-apuro";
}
var URGENCY_SCORE = {
	vencida: 6,
	hoy: 5,
	proxima: 3,
	"sin-apuro": .6
};
var IMPORTANCE_SCORE = {
	baja: 1,
	media: 2,
	alta: 4
};
function priorities(snap, today = todayISO()) {
	const items = [];
	for (const task of snap.tasks) {
		if (task.status !== "pendiente") continue;
		const urg = urgencyOf(task, today);
		const score = (task.pinned ? 20 : 0) + IMPORTANCE_SCORE[task.importance] * 2 + URGENCY_SCORE[urg];
		const when = !task.dueDate ? "Sin fecha" : urg === "vencida" ? "Vencida" : urg === "hoy" ? "Para hoy" : `Para el ${prettyShort(task.dueDate)}`;
		items.push({
			key: `tarea:${task.id}`,
			kind: "tarea",
			id: task.id,
			title: task.title,
			reason: `${when} · ${task.importance}`,
			score
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
			score
		});
	}
	return items.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 3);
}
function nextClass(snap, now = /* @__PURE__ */ new Date()) {
	const today = todayISO(now);
	const nowMin = now.getHours() * 60 + now.getMinutes();
	for (let i = 0; i < 10; i++) {
		const date = addDays(today, i);
		for (const block of classesOn(snap.blocks, date)) {
			const start = timeToMin(block.start);
			const end = timeToMin(block.end);
			if (i === 0 && end <= nowMin) continue;
			return {
				block,
				subject: subjectById(snap, block.subjectId),
				date,
				live: i === 0 && start <= nowMin && nowMin < end
			};
		}
	}
	return null;
}
function isDailyScheduled(habit, date) {
	if (habit.freq.kind !== "daily") return false;
	return habit.freq.days.includes(dow(date));
}
function habitMark(logs, habitId, date) {
	return logs.find((l) => l.habitId === habitId && l.date === date)?.mark;
}
function periodCount(habit, logs, date) {
	if (habit.freq.kind === "daily") return {
		done: habitMark(logs, habit.id, date) === "hecho" ? 1 : 0,
		target: 1
	};
	if (habit.freq.kind === "weekly") {
		const start = isoWeekKey(date);
		let done = 0;
		for (let i = 0; i < 7; i++) if (habitMark(logs, habit.id, addDays(start, i)) === "hecho") done++;
		return {
			done,
			target: habit.freq.target
		};
	}
	const key = monthKey(date);
	return {
		done: logs.filter((l) => l.habitId === habit.id && l.date.startsWith(key) && l.mark === "hecho").length,
		target: habit.freq.target
	};
}
function habitStreak(habit, logs, today) {
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
		if (periodCount(habit, logs, today).done >= target) streak = 1;
		for (let i = 1; i < 60; i++) {
			cursor = addDays(cursor, -7);
			if (periodCount(habit, logs, cursor).done >= target) streak++;
			else break;
		}
		return streak;
	}
	let cursor = monthKey(today);
	const met = (key) => logs.filter((l) => l.habitId === habit.id && l.date.startsWith(key) && l.mark === "hecho").length >= target;
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
function routineLog(logs, routineId, date) {
	return logs.find((l) => l.routineId === routineId && l.date === date);
}
function routineComplete(routine, logs, date) {
	if (routine.steps.length === 0) return false;
	const log = routineLog(logs, routine.id, date);
	return routine.steps.every((s) => log?.doneSteps.includes(s.id));
}
function dayProgress(snap, date) {
	const tasks = snap.tasks.filter((t) => t.status !== "cancelada" && t.dueDate === date);
	const habits = snap.habits.filter((h) => isDailyScheduled(h, date));
	const routines = snap.routines.filter((r) => !r.paused && r.days.includes(dow(date)));
	return {
		done: tasks.filter((t) => t.status === "hecha").length + habits.filter((h) => habitMark(snap.habitLogs, h.id, date) === "hecho").length + routines.filter((r) => routineComplete(r, snap.routineLogs, date)).length,
		total: tasks.length + habits.length + routines.length
	};
}
function searchAll(snap, q) {
	const query = q.trim().toLocaleLowerCase("es");
	if (!query) return [];
	const hits = [];
	const has = (...parts) => parts.some((p) => p?.toLocaleLowerCase("es").includes(query));
	for (const s of snap.subjects) if (has(s.name, s.teacher, s.room, s.notes)) hits.push({
		kind: "Materia",
		id: s.id,
		title: s.name,
		subtitle: s.teacher,
		view: "colegio"
	});
	for (const t of snap.tasks) if (has(t.title, t.description, t.notes, subjectName(snap, t.subjectId))) hits.push({
		kind: "Tarea",
		id: t.id,
		title: t.title,
		subtitle: t.dueDate ? prettyShort(t.dueDate) : "Sin fecha",
		view: "colegio"
	});
	for (const e of snap.exams) if (has(e.title, e.topics, e.notes, subjectName(snap, e.subjectId))) hits.push({
		kind: "Examen",
		id: e.id,
		title: e.title,
		subtitle: prettyShort(e.date),
		view: "colegio"
	});
	for (const ev of snap.events) if (has(ev.title, ev.description, ev.category)) hits.push({
		kind: "Evento",
		id: ev.id,
		title: ev.title,
		subtitle: prettyShort(ev.date),
		view: "agenda"
	});
	for (const r of snap.routines) if (has(r.title, ...r.steps.map((s) => s.title))) hits.push({
		kind: "Rutina",
		id: r.id,
		title: r.title,
		subtitle: r.time,
		view: "vida"
	});
	for (const h of snap.habits) if (has(h.title)) hits.push({
		kind: "Hábito",
		id: h.id,
		title: h.title,
		subtitle: "Hábito",
		view: "vida"
	});
	for (const n of snap.notes) if (has(n.title, n.content, n.category, n.tags.join(" "))) hits.push({
		kind: "Nota",
		id: n.id,
		title: n.title || "Sin título",
		subtitle: n.category || "Nota",
		view: "notas"
	});
	for (const i of snap.inbox) if (!i.archived && has(i.title, i.notes, i.category)) hits.push({
		kind: "Pendiente",
		id: i.id,
		title: i.title,
		subtitle: i.category || "Bandeja",
		view: "pendientes"
	});
	for (const s of snap.sessions) if (has(s.title)) hits.push({
		kind: "Estudio",
		id: s.id,
		title: s.title,
		subtitle: prettyShort(s.date),
		view: "estudio"
	});
	return hits.slice(0, 40);
}
function proposeWeek(snap, weekStart, now = /* @__PURE__ */ new Date()) {
	const today = todayISO(now);
	const weekEnd = addDays(weekStart, 6);
	const occupied = (date) => agendaOn(snap, date).filter((i) => i.start && i.end && i.source !== "tarea").map((i) => [timeToMin(i.start), timeToMin(i.end)]);
	const jobs = [];
	for (const task of snap.tasks) {
		if (task.status !== "pendiente" || !task.dueDate) continue;
		if (task.dueDate > addDays(weekEnd, 3)) continue;
		const planned = snap.sessions.filter((s) => s.taskId === task.id && s.status !== "cancelada").reduce((sum, s) => sum + s.plannedMinutes, 0);
		const need = Math.max(0, (task.estimatedMinutes ?? 40) - planned);
		if (need < 20) continue;
		jobs.push({
			title: task.title,
			minutes: need,
			due: task.dueDate < today ? addDays(today, 1) : task.dueDate,
			taskId: task.id,
			subjectId: task.subjectId,
			reason: task.dueDate < today ? "Atrasada, con tu autorización" : `Antes del ${prettyShort(task.dueDate)}`
		});
	}
	for (const exam of snap.exams) {
		if (exam.date < today || exam.date > addDays(weekEnd, 10)) continue;
		const planned = snap.sessions.filter((s) => s.examId === exam.id && s.status !== "cancelada").reduce((sum, s) => sum + s.plannedMinutes, 0);
		const need = Math.max(0, 80 - planned);
		if (need < 20) continue;
		jobs.push({
			title: `Estudiar: ${exam.title}`,
			minutes: need,
			due: exam.date,
			examId: exam.id,
			subjectId: exam.subjectId,
			reason: "Preparación para el examen"
		});
	}
	jobs.sort((a, b) => a.due.localeCompare(b.due));
	const placed = [];
	const proposals = [];
	const workStart = 960;
	const workEnd = 1230;
	const findSlot = (due, chunk) => {
		const from = weekStart < today ? today : weekStart;
		const last = due < from ? from : due < weekEnd ? due : weekEnd;
		for (let date = from; date <= last; date = addDays(date, 1)) {
			const blocks = [...occupied(date), ...placed.filter((p) => p.date === date).map((p) => [p.start, p.end])];
			let cursor = workStart;
			if (date === today) cursor = Math.max(cursor, Math.ceil((now.getHours() * 60 + now.getMinutes()) / 10) * 10);
			while (cursor + chunk <= workEnd) {
				const end = cursor + chunk;
				if (!blocks.some(([a, b]) => overlaps(cursor, end, a, b))) return {
					date,
					start: cursor,
					end
				};
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
				subjectId: job.subjectId
			});
			left -= chunk;
		}
	}
	return proposals;
}
function computeStats(snap, today = todayISO()) {
	const weekStart = startOfWeek(today);
	const tasksDone = snap.tasks.filter((t) => t.status === "hecha");
	let onTime = 0;
	let late = 0;
	for (const t of tasksDone) {
		if (!t.dueDate || !t.completedAt) continue;
		if (t.completedAt.slice(0, 10) <= t.dueDate) onTime++;
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
	const focusMinutes = snap.sessions.filter((s) => s.status === "completada" && s.date.startsWith(month)).reduce((sum, s) => sum + s.focusMinutes, 0);
	const weekBars = Array.from({ length: 7 }, (_, i) => {
		const date = addDays(weekStart, i);
		return {
			d: [
				"L",
				"M",
				"X",
				"J",
				"V",
				"S",
				"D"
			][i] || "",
			minutos: snap.sessions.filter((s) => s.date === date && s.status === "completada").reduce((sum, s) => sum + s.focusMinutes, 0),
			tareas: snap.tasks.filter((t) => t.status === "hecha" && t.completedAt?.slice(0, 10) === date).length
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
		habitRate: habitDenom === 0 ? 0 : Math.round(habitDone / habitDenom * 100),
		habitDone,
		habitMissed,
		habitSkipped,
		routineRate: routineScheduled === 0 ? 0 : Math.round(routineDone / routineScheduled * 100),
		routineDone,
		routineScheduled,
		weekBars
	};
}
function reminderMoments(date, time, offsets, now = /* @__PURE__ */ new Date()) {
	if (!date) return [];
	const base = combine(date, time || "08:00").getTime();
	return offsets.map((offset) => ({
		offset,
		at: base - offset * 6e4
	})).filter((r) => r.at <= now.getTime() && now.getTime() - r.at < 216e5);
}
function reminderCopy(kind, title, whenLabel) {
	if (kind === "examen") return {
		title: "LifeOS",
		body: `Tu examen de ${title} ${whenLabel}.`
	};
	if (kind === "rutina") return {
		title: "LifeOS",
		body: `Es hora de comenzar tu rutina: ${title}.`
	};
	if (kind === "estudio") return {
		title: "LifeOS",
		body: "Tenés una sesión de estudio programada."
	};
	if (kind === "noche") return {
		title: "LifeOS",
		body: "Revisá tus pendientes para mañana."
	};
	return {
		title: "LifeOS",
		body: `${whenLabel} ${title}.`.replace(/\s+/g, " ").trim()
	};
}
function currentFocusMs(run, now = Date.now()) {
	return run.accumulatedMs + (run.runningSince ? Math.max(0, now - run.runningSince) : 0);
}
function buildSeed(now = /* @__PURE__ */ new Date()) {
	const today = todayISO(now);
	const iso = (offset, hours, minutes) => {
		const d = new Date(now);
		d.setDate(d.getDate() + offset);
		d.setHours(hours, minutes, 0, 0);
		return d.toISOString();
	};
	const base = emptySnapshot();
	return {
		...base,
		prefs: {
			...base.prefs,
			sample: true,
			nightReminder: null
		},
		subjects: [
			{
				id: "sub-mat",
				name: "Matemática",
				teacher: "Prof. Benítez",
				room: "Aula 12",
				tone: "sage",
				notes: "Funciones y gráficos."
			},
			{
				id: "sub-his",
				name: "Historia",
				teacher: "Prof. Gómez",
				room: "Aula 4",
				tone: "clay",
				notes: ""
			},
			{
				id: "sub-len",
				name: "Lengua",
				teacher: "Prof. Aquino",
				room: "Aula 7",
				tone: "ink",
				notes: ""
			},
			{
				id: "sub-bio",
				name: "Biología",
				teacher: "Prof. Ruiz",
				room: "Laboratorio",
				tone: "sage",
				notes: ""
			},
			{
				id: "sub-ing",
				name: "Inglés",
				teacher: "Prof. Carter",
				room: "Aula 3",
				tone: "clay",
				notes: ""
			}
		],
		blocks: [
			{
				id: "b1",
				subjectId: "sub-mat",
				dayOfWeek: 1,
				start: "07:10",
				end: "08:00",
				room: "Aula 12",
				scope: "regular"
			},
			{
				id: "b2",
				subjectId: "sub-his",
				dayOfWeek: 1,
				start: "08:00",
				end: "08:50",
				room: "Aula 4",
				scope: "regular"
			},
			{
				id: "b3",
				subjectId: "sub-len",
				dayOfWeek: 1,
				start: "08:50",
				end: "09:40",
				room: "Aula 7",
				scope: "regular"
			},
			{
				id: "b4",
				subjectId: "sub-bio",
				dayOfWeek: 2,
				start: "07:10",
				end: "08:00",
				room: "Laboratorio",
				scope: "regular"
			},
			{
				id: "b5",
				subjectId: "sub-ing",
				dayOfWeek: 2,
				start: "08:00",
				end: "08:50",
				room: "Aula 3",
				scope: "regular"
			},
			{
				id: "b6",
				subjectId: "sub-mat",
				dayOfWeek: 2,
				start: "08:50",
				end: "09:40",
				room: "Aula 12",
				scope: "regular"
			},
			{
				id: "b7",
				subjectId: "sub-his",
				dayOfWeek: 3,
				start: "07:10",
				end: "08:50",
				room: "Aula 4",
				scope: "regular"
			},
			{
				id: "b8",
				subjectId: "sub-len",
				dayOfWeek: 3,
				start: "08:50",
				end: "09:40",
				room: "Aula 7",
				scope: "regular"
			},
			{
				id: "b9",
				subjectId: "sub-mat",
				dayOfWeek: 4,
				start: "07:10",
				end: "08:50",
				room: "Aula 12",
				scope: "regular"
			},
			{
				id: "b10",
				subjectId: "sub-bio",
				dayOfWeek: 4,
				start: "08:50",
				end: "09:40",
				room: "Laboratorio",
				scope: "regular"
			},
			{
				id: "b11",
				subjectId: "sub-ing",
				dayOfWeek: 5,
				start: "07:10",
				end: "08:00",
				room: "Aula 3",
				scope: "regular"
			},
			{
				id: "b12",
				subjectId: "sub-his",
				dayOfWeek: 5,
				start: "08:00",
				end: "08:50",
				room: "Aula 4",
				scope: "regular"
			},
			{
				id: "b13",
				subjectId: "sub-len",
				dayOfWeek: 5,
				start: "08:50",
				end: "09:40",
				room: "Aula 7",
				scope: "regular"
			}
		],
		tasks: [
			{
				id: "task-his-hoy",
				title: "Resumen de Historia",
				subjectId: "sub-his",
				description: "Una carilla sobre la guerra del Paraguay.",
				createdAt: iso(-2, 19, 0),
				dueDate: today,
				dueTime: "23:00",
				importance: "alta",
				urgencyMode: "auto",
				status: "pendiente",
				estimatedMinutes: 50,
				subtasks: [{
					id: "st1",
					title: "Elegir tres hechos",
					done: true
				}, {
					id: "st2",
					title: "Redactar y revisar",
					done: false
				}],
				notes: "",
				attachments: [],
				reminderOffsets: [60],
				pinned: true
			},
			{
				id: "task-lib",
				title: "Devolver el libro de la biblioteca",
				description: "",
				createdAt: iso(-5, 12, 0),
				dueDate: addDays(today, -1),
				dueTime: "16:00",
				importance: "media",
				urgencyMode: "auto",
				status: "pendiente",
				estimatedMinutes: 20,
				subtasks: [],
				notes: "",
				attachments: [],
				reminderOffsets: [],
				pinned: false
			},
			{
				id: "task-mat",
				title: "Trabajo de funciones",
				subjectId: "sub-mat",
				description: "Ejercicios 4 a 8 de la guía.",
				createdAt: iso(-3, 8, 0),
				dueDate: addDays(today, 2),
				dueTime: "07:10",
				importance: "alta",
				urgencyMode: "auto",
				status: "pendiente",
				estimatedMinutes: 90,
				subtasks: [{
					id: "st3",
					title: "Ejercicios pares",
					done: false
				}, {
					id: "st4",
					title: "Gráfico en hoja milimetrada",
					done: false
				}],
				notes: "Llevar calculadora.",
				attachments: [],
				reminderOffsets: [1440, 120],
				pinned: false
			},
			{
				id: "task-ing",
				title: "Ejercicios de Inglés, unidad 3",
				subjectId: "sub-ing",
				description: "",
				createdAt: iso(-4, 18, 0),
				dueDate: addDays(today, -1),
				dueTime: "18:00",
				importance: "baja",
				urgencyMode: "auto",
				status: "hecha",
				estimatedMinutes: 30,
				subtasks: [],
				notes: "",
				attachments: [],
				reminderOffsets: [],
				pinned: false,
				completedAt: iso(-1, 17, 10)
			}
		],
		exams: [{
			id: "ex-his",
			title: "Historia",
			subjectId: "sub-his",
			date: addDays(today, 5),
			time: "08:00",
			topics: "Revolución de Mayo y guerra del Paraguay.",
			notes: "Repasar la línea de tiempo del cuaderno.",
			reminderOffsets: [1440]
		}],
		events: [
			{
				id: "ev-repaso",
				title: "Repaso de Historia",
				date: addDays(today, 1),
				time: "17:00",
				endTime: "18:30",
				description: "En casa, sin pantalla.",
				category: "Estudio",
				importance: "alta",
				reminderOffsets: [30],
				recurrence: null,
				exceptions: []
			},
			{
				id: "ev-feria",
				title: "Feria de ciencias",
				date: addDays(today, 12),
				time: "09:00",
				endTime: "12:00",
				description: "Stand de Biología.",
				category: "Colegio",
				importance: "media",
				reminderOffsets: [1440],
				recurrence: null,
				exceptions: []
			},
			{
				id: "ev-train",
				title: "Entrenamiento",
				date: addDays(today, -4),
				time: "17:00",
				endTime: "18:00",
				description: "",
				category: "Deporte",
				importance: "baja",
				reminderOffsets: [60],
				recurrence: {
					freq: "weekly",
					interval: 1,
					days: [2, 4]
				},
				exceptions: []
			}
		],
		routines: [{
			id: "rt-salida",
			title: "Salida al colegio",
			time: "06:20",
			durationMin: 40,
			days: [
				1,
				2,
				3,
				4,
				5
			],
			steps: [
				{
					id: "rs1",
					title: "Desayunar"
				},
				{
					id: "rs2",
					title: "Revisar el horario"
				},
				{
					id: "rs3",
					title: "Mochila"
				},
				{
					id: "rs4",
					title: "Salir"
				}
			],
			paused: false,
			reminderOffsets: [0]
		}],
		habits: [
			{
				id: "h-leer",
				title: "Leer 20 minutos",
				freq: {
					kind: "weekly",
					target: 4
				},
				tone: "sage"
			},
			{
				id: "h-mochila",
				title: "Preparar la mochila",
				freq: {
					kind: "daily",
					days: [
						0,
						1,
						2,
						3,
						4
					]
				},
				tone: "clay"
			},
			{
				id: "h-dormir",
				title: "Dormir antes de las 23",
				freq: {
					kind: "daily",
					days: [
						0,
						1,
						2,
						3,
						4,
						5,
						6
					]
				},
				tone: "ink"
			}
		],
		habitLogs: [
			{
				habitId: "h-leer",
				date: addDays(today, -5),
				mark: "hecho"
			},
			{
				habitId: "h-leer",
				date: addDays(today, -3),
				mark: "hecho"
			},
			{
				habitId: "h-leer",
				date: addDays(today, -1),
				mark: "hecho"
			},
			{
				habitId: "h-dormir",
				date: addDays(today, -1),
				mark: "hecho"
			},
			{
				habitId: "h-dormir",
				date: addDays(today, -2),
				mark: "hecho"
			},
			{
				habitId: "h-dormir",
				date: addDays(today, -3),
				mark: "omitido"
			},
			{
				habitId: "h-mochila",
				date: addDays(today, -1),
				mark: "hecho"
			},
			{
				habitId: "h-mochila",
				date: addDays(today, -2),
				mark: "hecho"
			}
		],
		sessions: [{
			id: "ses-1",
			title: "Línea de tiempo de Historia",
			subjectId: "sub-his",
			examId: "ex-his",
			date: addDays(today, -1),
			start: "16:30",
			plannedMinutes: 40,
			focusMinutes: 35,
			status: "completada"
		}],
		notes: [{
			id: "note-1",
			title: "Fórmula cuadrática",
			content: "x = (-b ± √(b² − 4ac)) / 2a. Ojo con el signo de b.",
			category: "Matemática",
			tags: ["fórmulas"],
			links: [{
				kind: "materia",
				id: "sub-mat"
			}],
			updatedAt: iso(-2, 21, 0)
		}],
		inbox: [{
			id: "in-1",
			title: "Resumen visual de Biología",
			notes: "Una hoja con el ciclo que vimos en el lab.",
			category: "Ideas",
			createdAt: iso(-1, 20, 0),
			archived: false
		}, {
			id: "in-2",
			title: "Pedir los apuntes a Lucía",
			notes: "",
			category: "Colegio",
			createdAt: iso(0, 11, 0),
			archived: false
		}],
		backpack: [...base.backpack, {
			id: "bp-calc",
			label: "Calculadora"
		}]
	};
}
var KEY = "snapshot";
var saveTimer = null;
var starting = false;
function queueSave(snap) {
	if (typeof indexedDB === "undefined") return;
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		idbSet(KEY, snap);
	}, 160);
}
async function saveNow(snap) {
	if (saveTimer) clearTimeout(saveTimer);
	if (typeof indexedDB === "undefined") return;
	await idbSet(KEY, snap);
}
function withDefaults(saved) {
	const base = emptySnapshot();
	return {
		...base,
		...saved,
		version: 1,
		prefs: {
			...base.prefs,
			...saved.prefs
		},
		backpack: saved.backpack?.length ? saved.backpack : base.backpack,
		focus: saved.focus ?? null,
		fired: saved.fired ?? [],
		notices: saved.notices ?? [],
		backpackChecks: saved.backpackChecks ?? {}
	};
}
function normalizeImport(raw) {
	if (!raw || typeof raw !== "object") throw new Error("Ese archivo no es una copia de LifeOS.");
	const data = raw;
	if (data.version !== 1 || !Array.isArray(data.tasks) || !Array.isArray(data.subjects)) throw new Error("La copia no tiene el formato de LifeOS.");
	return withDefaults(data);
}
function upsert(list, item) {
	const i = list.findIndex((x) => x.id === item.id);
	if (i === -1) return [item, ...list];
	const next = list.slice();
	next[i] = item;
	return next;
}
var useLife = create((set, get) => {
	const update = (fn) => {
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
				const saved = await idbGet(KEY);
				const snap = saved ? withDefaults(saved) : buildSeed();
				set({
					snap,
					ready: true
				});
				if (!saved) await saveNow(snap);
			} catch {
				set({
					snap: buildSeed(),
					ready: true
				});
			}
			const persist = () => {
				saveNow(get().snap);
			};
			window.addEventListener("pagehide", persist);
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") persist();
			});
		},
		async persist() {
			await saveNow(get().snap);
		},
		upsertSubject: (item) => update((s) => ({
			...s,
			subjects: upsert(s.subjects, item)
		})),
		deleteSubject: (id) => update((s) => ({
			...s,
			subjects: s.subjects.filter((x) => x.id !== id),
			blocks: s.blocks.filter((b) => b.subjectId !== id),
			tasks: s.tasks.map((t) => t.subjectId === id ? {
				...t,
				subjectId: void 0
			} : t)
		})),
		upsertBlock: (item) => update((s) => ({
			...s,
			blocks: upsert(s.blocks, item)
		})),
		deleteBlock: (id) => update((s) => ({
			...s,
			blocks: s.blocks.filter((b) => b.id !== id && b.replacesId !== id && b.cancelOf !== id)
		})),
		cancelBlockOn: (blockId, date) => update((s) => {
			const id = `cancel-${blockId}-${date}`;
			if (s.blocks.some((b) => b.id === id)) return s;
			const base = s.blocks.find((b) => b.id === blockId);
			if (!base) return s;
			const cancel = {
				...base,
				id,
				scope: "once",
				date,
				cancelOf: blockId,
				replacesId: void 0
			};
			return {
				...s,
				blocks: [...s.blocks, cancel]
			};
		}),
		upsertTask: (item) => update((s) => ({
			...s,
			tasks: upsert(s.tasks, item)
		})),
		deleteTask: (id) => update((s) => ({
			...s,
			tasks: s.tasks.filter((t) => t.id !== id)
		})),
		setTaskStatus: (id, status) => update((s) => ({
			...s,
			tasks: s.tasks.map((t) => t.id === id ? {
				...t,
				status,
				completedAt: status === "hecha" ? (/* @__PURE__ */ new Date()).toISOString() : void 0
			} : t)
		})),
		toggleSubtask: (taskId, subId) => update((s) => ({
			...s,
			tasks: s.tasks.map((t) => t.id === taskId ? {
				...t,
				subtasks: t.subtasks.map((st) => st.id === subId ? {
					...st,
					done: !st.done
				} : st)
			} : t)
		})),
		upsertExam: (item) => update((s) => ({
			...s,
			exams: upsert(s.exams, item)
		})),
		deleteExam: (id) => update((s) => ({
			...s,
			exams: s.exams.filter((e) => e.id !== id)
		})),
		upsertEvent: (item) => update((s) => ({
			...s,
			events: upsert(s.events, item)
		})),
		deleteEvent: (id) => update((s) => ({
			...s,
			events: s.events.filter((e) => e.id !== id)
		})),
		skipEventOn: (id, date) => update((s) => ({
			...s,
			events: s.events.map((ev) => {
				if (ev.id !== id) return ev;
				const exceptions = ev.exceptions.filter((e) => e.date !== date);
				if (!ev.recurrence && ev.date === date) return ev;
				return {
					...ev,
					exceptions: [...exceptions, {
						date,
						type: "skip"
					}]
				};
			})
		})),
		overrideEventOn: (id, date, patch) => update((s) => ({
			...s,
			events: s.events.map((ev) => {
				if (ev.id !== id) return ev;
				const exceptions = ev.exceptions.filter((e) => e.date !== date);
				return {
					...ev,
					exceptions: [...exceptions, patch]
				};
			})
		})),
		upsertRoutine: (item) => update((s) => ({
			...s,
			routines: upsert(s.routines, item)
		})),
		deleteRoutine: (id) => update((s) => ({
			...s,
			routines: s.routines.filter((r) => r.id !== id),
			routineLogs: s.routineLogs.filter((l) => l.routineId !== id)
		})),
		toggleRoutinePause: (id) => update((s) => ({
			...s,
			routines: s.routines.map((r) => r.id === id ? {
				...r,
				paused: !r.paused
			} : r)
		})),
		toggleStep: (routineId, date, stepId) => update((s) => {
			const existing = s.routineLogs.find((l) => l.routineId === routineId && l.date === date);
			const done = new Set(existing?.doneSteps ?? []);
			if (done.has(stepId)) done.delete(stepId);
			else done.add(stepId);
			const log = {
				routineId,
				date,
				doneSteps: [...done]
			};
			const routineLogs = existing ? s.routineLogs.map((l) => l === existing ? log : l) : [...s.routineLogs, log];
			return {
				...s,
				routineLogs
			};
		}),
		upsertHabit: (item) => update((s) => ({
			...s,
			habits: upsert(s.habits, item)
		})),
		deleteHabit: (id) => update((s) => ({
			...s,
			habits: s.habits.filter((h) => h.id !== id),
			habitLogs: s.habitLogs.filter((l) => l.habitId !== id)
		})),
		markHabit: (habitId, date, mark) => update((s) => {
			const habitLogs = s.habitLogs.filter((l) => !(l.habitId === habitId && l.date === date));
			if (mark) habitLogs.push({
				habitId,
				date,
				mark
			});
			return {
				...s,
				habitLogs
			};
		}),
		upsertSession: (item) => update((s) => ({
			...s,
			sessions: upsert(s.sessions, item)
		})),
		deleteSession: (id) => update((s) => ({
			...s,
			sessions: s.sessions.filter((x) => x.id !== id)
		})),
		acceptProposals: (items) => update((s) => {
			let sessions = s.sessions;
			for (const item of items) {
				const session = {
					id: item.id,
					title: item.title,
					date: item.date,
					start: item.start,
					plannedMinutes: item.minutes,
					focusMinutes: 0,
					status: "planificada",
					taskId: item.taskId,
					examId: item.examId,
					subjectId: item.subjectId
				};
				sessions = upsert(sessions, session);
			}
			return {
				...s,
				sessions
			};
		}),
		upsertNote: (item) => update((s) => ({
			...s,
			notes: upsert(s.notes, {
				...item,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			})
		})),
		deleteNote: (id) => update((s) => ({
			...s,
			notes: s.notes.filter((n) => n.id !== id)
		})),
		upsertInbox: (item) => update((s) => ({
			...s,
			inbox: upsert(s.inbox, item)
		})),
		deleteInbox: (id) => update((s) => ({
			...s,
			inbox: s.inbox.filter((i) => i.id !== id)
		})),
		convertInbox: (id, kind) => {
			const item = get().snap.inbox.find((i) => i.id === id);
			if (!item) return null;
			if (item.converted) {
				if (item.converted.kind === "tarea" && get().snap.tasks.some((t) => t.id === item.converted?.id) || item.converted.kind !== "tarea" && get().snap.events.some((e) => e.id === item.converted?.id)) return item.converted.id;
			}
			const created = newId();
			update((s) => {
				const inbox = s.inbox.map((i) => i.id === id ? {
					...i,
					archived: true,
					converted: {
						kind,
						id: created
					}
				} : i);
				if (kind === "tarea") return {
					...s,
					inbox,
					tasks: [blankTask({
						id: created,
						title: item.title,
						description: item.notes,
						reminderOffsets: []
					}), ...s.tasks]
				};
				const tomorrow = addDays(todayISO(), 1);
				return {
					...s,
					inbox,
					events: [blankEvent({
						id: created,
						title: item.title,
						description: item.notes,
						date: tomorrow,
						time: kind === "recordatorio" ? "09:00" : void 0,
						category: kind === "recordatorio" ? "Recordatorio" : "Personal",
						reminderOffsets: kind === "recordatorio" ? [0] : []
					}), ...s.events]
				};
			});
			return created;
		},
		addBackpack: (label) => update((s) => ({
			...s,
			backpack: [...s.backpack, {
				id: newId(),
				label: label.trim()
			}]
		})),
		deleteBackpack: (id) => update((s) => ({
			...s,
			backpack: s.backpack.filter((b) => b.id !== id)
		})),
		toggleBackpack: (date, id) => update((s) => {
			const current = new Set(s.backpackChecks[date] ?? []);
			if (current.has(id)) current.delete(id);
			else current.add(id);
			return {
				...s,
				backpackChecks: {
					...s.backpackChecks,
					[date]: [...current]
				}
			};
		}),
		setPrefs: (partial) => update((s) => ({
			...s,
			prefs: {
				...s.prefs,
				...partial
			}
		})),
		setFocus: (focus) => update((s) => ({
			...s,
			focus
		})),
		patchFocus: (partial) => update((s) => ({
			...s,
			focus: s.focus ? {
				...s.focus,
				...partial
			} : s.focus
		})),
		dismissNotice: (id) => update((s) => ({
			...s,
			notices: s.notices.filter((n) => n.id !== id)
		})),
		flushReminders: () => {
			const snap = get().snap;
			const now = /* @__PURE__ */ new Date();
			const today = todayISO(now);
			const fired = new Set(snap.fired);
			const fresh = [];
			const push = (key, title, body, view) => {
				if (fired.has(key)) return;
				fired.add(key);
				fresh.push({
					id: newId(),
					at: now.toISOString(),
					title,
					body,
					view,
					read: false
				});
				showLocalNotice(title, body, view, key);
			};
			for (const task of snap.tasks) {
				if (task.status !== "pendiente" || !task.dueDate) continue;
				for (const moment of reminderMoments(task.dueDate, task.dueTime, task.reminderOffsets, now)) {
					const soon = task.dueDate === today ? "es hoy:" : "se acerca:";
					const copy = reminderCopy("tarea", task.title, `Mañana no: ${soon}`);
					const body = task.dueDate === addDays(today, 1) ? `Mañana tenés que entregar: ${task.title}.` : task.dueDate === today ? `Hoy tenés que entregar: ${task.title}.` : `Recordatorio: ${task.title}.`;
					push(`tarea:${task.id}:${moment.offset}:${moment.at}`, copy.title, body, "colegio");
				}
			}
			for (const exam of snap.exams) for (const moment of reminderMoments(exam.date, exam.time, exam.reminderOffsets, now)) {
				const when = exam.date === addDays(today, 1) ? "es mañana" : exam.date === today ? "es hoy" : "se acerca";
				const copy = reminderCopy("examen", exam.title, when);
				push(`examen:${exam.id}:${moment.offset}:${moment.at}`, copy.title, copy.body, "colegio");
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
			for (const ev of snap.events) for (const date of [today, addDays(today, 1)]) {
				if (!eventOccursOn(ev, date)) continue;
				const view = eventView(ev, date);
				if (!view.time) continue;
				for (const moment of reminderMoments(date, view.time, ev.reminderOffsets, now)) push(`evento:${ev.id}:${date}:${moment.offset}:${moment.at}`, "LifeOS", `Tenés un evento: ${view.title}.`, "agenda");
			}
			if (snap.prefs.nightReminder) for (const moment of reminderMoments(today, snap.prefs.nightReminder, [0], now)) {
				const copy = reminderCopy("noche", "", "");
				push(`noche:${today}:${moment.at}`, copy.title, copy.body, "manana");
			}
			if (!fresh.length) return;
			update((s) => ({
				...s,
				fired: [...fired].slice(-500),
				notices: [...fresh, ...s.notices].slice(0, 20)
			}));
		},
		emptyAll: () => {
			const snap = emptySnapshot();
			set({ snap });
			saveNow(snap);
		},
		loadSample: () => {
			const snap = buildSeed();
			set({ snap });
			saveNow(snap);
		},
		importSnap: (snap) => {
			const next = withDefaults(snap);
			set({ snap: next });
			saveNow(next);
		}
	};
});
var VIEW_IDS = [
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
	"buscar"
];
var fieldClass = "min-h-12 w-full rounded-2xl border border-line bg-card px-3 text-base text-ink outline-none";
function Panel({ title, onClose, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex justify-center bg-ink/40",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": title,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-lg flex-col bg-paper text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center gap-2 border-b border-line bg-paper px-3 pt-safe pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "grid size-11 place-items-center rounded-full",
						"aria-label": "Cerrar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl leading-none",
						children: title
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-4 py-4",
					children
				}),
				footer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t border-line px-4 pt-3 pb-safe",
					children: footer
				}) : null
			]
		})
	});
}
function Btn({ variant = "solid", className = "", ...props }) {
	const look = {
		solid: "bg-sage text-paper",
		ghost: "bg-transparent text-ink",
		clay: "bg-clay text-paper",
		soft: "bg-sage-soft text-sage"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-base font-medium transition-transform active:scale-[0.98] disabled:opacity-50 ${look} ${className}`,
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mb-3 block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-sm text-ink-soft",
			children: label
		}), children]
	});
}
function Section({ title, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl leading-none",
				children: title
			}), action]
		}), children]
	});
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-card border border-dashed border-line bg-card px-4 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: action
			}) : null
		]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-card border border-line bg-card p-3 ${className}`,
		children
	});
}
function Segmented({ value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 flex gap-1 rounded-2xl bg-line/70 p-1",
		children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => onChange(opt.id),
			className: `min-h-10 flex-1 rounded-xl px-2 text-sm font-medium ${value === opt.id ? "bg-card text-ink" : "text-ink-soft"}`,
			"aria-pressed": value === opt.id,
			children: opt.label
		}, opt.id))
	});
}
function toneClass(tone) {
	if (tone === "sage") return "bg-sage-soft text-sage";
	if (tone === "clay") return "bg-clay-soft text-clay";
	return "bg-line text-ink";
}
function CheckButton({ done, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		"aria-label": label,
		className: `grid size-11 shrink-0 place-items-center rounded-full border ${done ? "border-sage bg-sage text-paper" : "border-line bg-card text-transparent"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-4",
			strokeWidth: 2.5
		})
	});
}
function Agenda({ onOpen }) {
	const snap = useLife((s) => s.snap);
	const skip = useLife((s) => s.skipEventOn);
	const removeEvent = useLife((s) => s.deleteEvent);
	const [mode, setMode] = (0, import_react.useState)("mes");
	const [cursor, setCursor] = (0, import_react.useState)(todayISO());
	const [query, setQuery] = (0, import_react.useState)("");
	const today = todayISO();
	const monthStart = startOfMonth(cursor);
	const gridStart = startOfWeek(monthStart);
	const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
	const weekStart = startOfWeek(cursor);
	const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	const dayItems = agendaOn(snap, cursor);
	const clashes = conflictsOn(dayItems);
	const filtered = query.trim() ? snap.events.filter((ev) => `${ev.title} ${ev.description} ${ev.category}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es"))) : [];
	const openItem = (item) => {
		if (item.source === "clase") onOpen({
			kind: "bloque",
			id: item.sourceId,
			date: item.date
		});
		else if (item.source === "tarea") onOpen({
			kind: "tarea",
			id: item.sourceId
		});
		else if (item.source === "examen") onOpen({
			kind: "examen",
			id: item.sourceId
		});
		else if (item.source === "rutina") onOpen({
			kind: "rutina",
			id: item.sourceId
		});
		else if (item.source === "estudio") onOpen({
			kind: "sesion",
			id: item.sourceId
		});
		else onOpen({
			kind: "evento",
			id: item.sourceId,
			date: item.date,
			scope: "serie"
		});
	};
	const counts = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const date of cells) map.set(date, agendaOn(snap, date).length);
		return map;
	}, [snap, cells]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-none",
				children: "Agenda"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "soft",
				className: "min-h-10",
				onClick: () => onOpen({
					kind: "evento",
					date: cursor
				}),
				children: "Nuevo"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "mb-3 min-h-12 w-full rounded-2xl border border-line bg-card px-3 text-base",
			placeholder: "Buscar eventos",
			value: query,
			onChange: (e) => setQuery(e.target.value)
		}),
		query.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 grid gap-2",
			children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Sin resultados",
				body: "Probá con otro nombre o categoría."
			}) : filtered.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-left",
				onClick: () => onOpen({
					kind: "evento",
					id: ev.id
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: ev.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-ink-soft",
					children: [
						prettyShort(ev.date),
						" · ",
						ev.category
					]
				})] })
			}, ev.id))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: mode,
			onChange: setMode,
			options: [
				{
					id: "mes",
					label: "Mes"
				},
				{
					id: "semana",
					label: "Semana"
				},
				{
					id: "dia",
					label: "Día"
				}
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-full border border-line",
					"aria-label": "Anterior",
					onClick: () => setCursor(addDays(cursor, mode === "mes" ? -30 : mode === "semana" ? -7 : -1)),
					children: "‹"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: mode === "dia" ? prettyDate(cursor) : prettyShort(mode === "semana" ? weekStart : monthStart)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center rounded-full border border-line",
					"aria-label": "Siguiente",
					onClick: () => setCursor(addDays(cursor, mode === "mes" ? 30 : mode === "semana" ? 7 : 1)),
					children: "›"
				})
			]
		}),
		mode === "mes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 grid grid-cols-7 text-center text-xs text-ink-soft",
			children: [
				"L",
				"M",
				"X",
				"J",
				"V",
				"S",
				"D"
			].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, d))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 grid grid-cols-7 gap-1",
			children: cells.map((date) => {
				const inMonth = date.slice(0, 7) === monthStart.slice(0, 7);
				const selected = date === cursor;
				const n = counts.get(date) ?? 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setCursor(date);
						setMode("dia");
					},
					className: `flex min-h-12 flex-col items-center justify-center rounded-xl text-sm tabular-nums ${selected ? "bg-sage text-paper" : "bg-card"} ${inMonth ? "" : "opacity-40"}`,
					children: [Number(date.slice(8)), n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-0.5 size-1.5 rounded-full ${selected ? "bg-paper" : "bg-clay"}` }) : null]
				}, date);
			})
		})] }) : null,
		mode === "semana" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 grid gap-3",
			children: weekDays.map((date) => {
				const list = agendaOn(snap, date);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mb-1 text-sm text-ink-soft",
					onClick: () => {
						setCursor(date);
						setMode("dia");
					},
					children: [
						date === today ? "Hoy" : prettyDate(date),
						" · ",
						list.length
					]
				}), list.slice(0, 3).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex min-h-11 w-full items-center gap-2 text-left",
					onClick: () => openItem(item),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-12 tabular-nums text-sm text-ink-soft",
						children: item.start ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
				}, item.key))] }, date);
			})
		}) : null,
		mode !== "semana" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "En este día",
			children: dayItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Nada en esta fecha",
				body: "Las clases, entregas, exámenes, rutinas y sesiones aparecen acá sin duplicarse."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: dayItems.map((item) => {
					const clash = clashes.get(item.key);
					const event = item.source === "evento" ? snap.events.find((e) => e.id === item.sourceId) : void 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "w-full text-left",
						onClick: () => openItem(item),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs uppercase tracking-wide text-ink-soft",
								children: [
									item.source,
									item.start ? ` · ${item.start}` : "",
									item.end ? `–${item.end}` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-ink-soft",
								children: item.detail
							}),
							clash?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-clay",
								children: ["Se cruza con ", clash.join(", ")]
							}) : null
						]
					}), event?.recurrence ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-sage",
								onClick: () => onOpen({
									kind: "evento",
									id: event.id,
									date: item.date,
									scope: "dia"
								}),
								children: "Solo este día"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-sage",
								onClick: () => onOpen({
									kind: "evento",
									id: event.id,
									scope: "serie"
								}),
								children: "Toda la serie"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-clay",
								onClick: () => skip(event.id, item.date),
								children: "Quitar este día"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-clay",
								onClick: () => removeEvent(event.id),
								children: "Borrar serie"
							})
						]
					}) : null] }, item.key);
				})
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-ink-soft",
			children: [
				"Mes de ",
				daysInMonth(monthStart),
				" días. Semana desde el lunes."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: dow(cursor)
		})
	] });
}
function Extra({ view, go, onOpen }) {
	if (view === "pendientes") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxScreen, { onOpen });
	if (view === "estudio") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyScreen, { onOpen });
	if (view === "manana") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TomorrowScreen, { onOpen });
	if (view === "semana") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekScreen, {});
	if (view === "notas") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesScreen, { onOpen });
	if (view === "stats") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, {});
	if (view === "ajustes") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, {});
	if (view === "buscar") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchScreen, {
		onOpen,
		go
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreHome, { go });
}
function MoreHome({ go }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-4 font-display text-4xl leading-none",
		children: "Más"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: [
			{
				id: "pendientes",
				label: "Pendientes",
				hint: "Ideas sin fecha",
				icon: Inbox
			},
			{
				id: "estudio",
				label: "Estudio",
				hint: "Concentración",
				icon: Timer
			},
			{
				id: "manana",
				label: "Preparar mañana",
				hint: "Clases y mochila",
				icon: Sunrise
			},
			{
				id: "semana",
				label: "Mi semana",
				hint: "Una propuesta editable",
				icon: CalendarRange
			},
			{
				id: "notas",
				label: "Notas",
				hint: "Apuntes sueltos",
				icon: StickyNote
			},
			{
				id: "stats",
				label: "Estadísticas",
				hint: "Solo lo que hiciste",
				icon: ChartColumn
			},
			{
				id: "buscar",
				label: "Buscar",
				hint: "En todo LifeOS",
				icon: Search
			},
			{
				id: "ajustes",
				label: "Ajustes",
				hint: "Avisos, copia, tema",
				icon: Settings
			}
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => go(item.id),
			className: "min-h-28 rounded-card border border-line bg-card p-3 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "mb-3 size-5 text-sage" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: item.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-ink-soft",
					children: item.hint
				})
			]
		}, item.id))
	})] });
}
function InboxScreen({ onOpen }) {
	const inbox = useLife((s) => s.snap.inbox);
	const convert = useLife((s) => s.convertInbox);
	const [q, setQ] = (0, import_react.useState)("");
	const [showArchived, setShowArchived] = (0, import_react.useState)(false);
	const items = inbox.filter((item) => (showArchived ? item.archived : !item.archived) && `${item.title} ${item.notes} ${item.category}`.toLocaleLowerCase("es").includes(q.trim().toLocaleLowerCase("es")));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-none",
				children: "Pendientes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "soft",
				className: "min-h-10",
				onClick: () => onOpen({ kind: "inbox" }),
				children: "Nuevo"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: `${fieldClass} mb-3`,
			placeholder: "Buscar",
			value: q,
			onChange: (e) => setQ(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mb-3 text-sm text-sage",
			onClick: () => setShowArchived((v) => !v),
			children: showArchived ? "Ver activos" : "Ver archivados"
		}),
		items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Bandeja vacía",
			body: "Guardá acá lo que todavía no tiene fecha. Después lo convertís en tarea, evento o recordatorio."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "w-full text-left",
				onClick: () => onOpen({
					kind: "inbox",
					id: item.id
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-ink-soft",
					children: [item.category || "Sin categoría", item.notes ? ` · ${item.notes}` : ""]
				})]
			}), !item.archived ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-sage",
						onClick: () => convert(item.id, "tarea"),
						children: "Hacer tarea"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-sage",
						onClick: () => convert(item.id, "evento"),
						children: "Hacer evento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-sage",
						onClick: () => convert(item.id, "recordatorio"),
						children: "Hacer recordatorio"
					})
				]
			}) : item.converted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink-soft",
				children: ["Ya es ", item.converted.kind]
			}) : null] }, item.id))
		})
	] });
}
function StudyScreen({ onOpen }) {
	const snap = useLife((s) => s.snap);
	const setFocus = useLife((s) => s.setFocus);
	const patchFocus = useLife((s) => s.patchFocus);
	const upsertSession = useLife((s) => s.upsertSession);
	const focus = snap.focus;
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const [title, setTitle] = (0, import_react.useState)("Sesión de estudio");
	const [target, setTarget] = (0, import_react.useState)(25);
	const [taskId, setTaskId] = (0, import_react.useState)("");
	const [examId, setExamId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!focus?.runningSince) return;
		const id = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(id);
	}, [focus?.runningSince]);
	const elapsed = focus ? currentFocusMs(focus, now) : 0;
	const start = () => {
		const session = blankSession({
			title: title.trim() || "Sesión de estudio",
			date: todayISO(),
			start: nowTime(),
			plannedMinutes: target,
			taskId: taskId || void 0,
			examId: examId || void 0,
			subjectId: snap.tasks.find((t) => t.id === taskId)?.subjectId || snap.exams.find((e) => e.id === examId)?.subjectId
		});
		upsertSession(session);
		setFocus({
			sessionId: session.id,
			title: session.title,
			targetMinutes: target,
			accumulatedMs: 0,
			runningSince: Date.now(),
			taskId: taskId || void 0,
			examId: examId || void 0,
			subjectId: session.subjectId
		});
	};
	const pause = () => {
		if (!focus?.runningSince) return;
		patchFocus({
			accumulatedMs: currentFocusMs(focus),
			runningSince: null
		});
	};
	const finish = (cancel) => {
		if (!focus) return;
		const minutes = Math.round(currentFocusMs(focus) / 6e4);
		const session = snap.sessions.find((s) => s.id === focus.sessionId);
		if (session) upsertSession({
			...session,
			focusMinutes: minutes,
			status: cancel && minutes === 0 ? "cancelada" : "completada"
		});
		setFocus(null);
	};
	const history = [...snap.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.start ?? "").localeCompare(a.start ?? "")).slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 font-display text-4xl leading-none",
			children: "Estudio"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-4 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-6xl tabular-nums leading-none",
					children: formatMs(elapsed)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: focus ? focus.title : `Meta ${target} min`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Las pausas no suman."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-2",
					children: [!focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: start,
						children: "Iniciar"
					}) : focus.runningSince ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: pause,
						children: "Pausar"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => patchFocus({ runningSince: Date.now() }),
						children: "Reanudar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "ghost",
						disabled: !focus,
						onClick: () => finish(false),
						children: "Finalizar"
					})]
				})
			]
		}),
		!focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "En qué",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Minutos",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						15,
						25,
						40,
						50
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTarget(n),
						className: `min-h-11 rounded-2xl tabular-nums ${target === n ? "bg-sage text-paper" : "border border-line bg-card"}`,
						children: n
					}, n))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tarea",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: taskId,
					onChange: (e) => setTaskId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Ninguna"
					}), snap.tasks.filter((t) => t.status === "pendiente").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.title
					}, t.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Examen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Ninguno"
					}), snap.exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})
			})
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Historial",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-sage",
				onClick: () => onOpen({ kind: "sesion" }),
				children: "Planificar"
			}),
			children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Todavía no hay sesiones",
				body: "Cuando termines una, el tiempo real queda guardado."
			}) : history.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-12 w-full items-center justify-between gap-3 text-left",
				onClick: () => onOpen({
					kind: "sesion",
					id: session.id
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block",
					children: session.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-ink-soft",
					children: [
						prettyShort(session.date),
						" · ",
						session.status
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums text-sm",
					children: [session.focusMinutes, " min"]
				})]
			}, session.id))
		})
	] });
}
function formatMs(ms) {
	const total = Math.max(0, Math.floor(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function TomorrowScreen({ onOpen }) {
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
	const [label, setLabel] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-1 font-display text-4xl leading-none",
			children: "Mañana"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-ink-soft",
			children: prettyDate(tomorrow)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Te espera",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Mañana está libre",
				body: "No hay clases, entregas, eventos ni rutinas."
			}) : items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-12 w-full items-center gap-3 text-left",
				onClick: () => onOpen(item.source === "tarea" ? {
					kind: "tarea",
					id: item.sourceId
				} : item.source === "examen" ? {
					kind: "examen",
					id: item.sourceId
				} : item.source === "evento" ? {
					kind: "evento",
					id: item.sourceId,
					date: tomorrow
				} : item.source === "rutina" ? {
					kind: "rutina",
					id: item.sourceId
				} : item.source === "estudio" ? {
					kind: "sesion",
					id: item.sourceId
				} : {
					kind: "bloque",
					id: item.sourceId,
					date: tomorrow
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-12 tabular-nums text-sm text-ink-soft",
					children: item.start ?? "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-ink-soft",
					children: item.detail
				})] })]
			}, item.key))
		}),
		late.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Atrasadas",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm text-ink-soft",
				children: "No las muevo solas. Si querés, pasalas a mañana."
			}), late.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: task.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-sage",
					onClick: () => upsertTask({
						...task,
						dueDate: tomorrow
					}),
					children: "Pasar a mañana"
				})]
			}, task.id))]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Mochila",
			children: [snap.backpack.map((item) => {
				const on = checks.includes(item.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-h-11 flex-1 items-center gap-3 text-left",
						onClick: () => toggle(tomorrow, item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-4 rounded-full border ${on ? "border-sage bg-sage" : "border-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: on ? "text-ink-soft line-through" : "",
							children: item.label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-clay",
						onClick: () => remove(item.id),
						children: "Quitar"
					})]
				}, item.id);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: label,
					placeholder: "Sumar a la lista",
					onChange: (e) => setLabel(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					onClick: () => {
						if (!label.trim()) return;
						add(label);
						setLabel("");
					},
					children: "Sumar"
				})]
			})]
		})
	] });
}
function WeekScreen() {
	const snap = useLife((s) => s.snap);
	const accept = useLife((s) => s.acceptProposals);
	const today = todayISO();
	const week = startOfWeek(today);
	const proposals = proposeWeek(snap, week);
	const [picked, setPicked] = (0, import_react.useState)([]);
	const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-2 font-display text-4xl leading-none",
			children: "Mi semana"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-ink-soft",
			children: "Miro entregas, clases y huecos de 16:00 a 20:30. Nada entra al calendario hasta que lo confirmes."
		}),
		days.map((date) => {
			const list = agendaOn(snap, date);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: date === today ? "Hoy" : prettyShort(date)
				}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "Libre"
				}) : list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-ink-soft",
						children: [item.start ?? "·", " "]
					}), item.title]
				}, item.key))]
			}, date);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Organizar mi semana",
			children: [proposals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "No hay huecos útiles",
				body: "O ya cubriste el tiempo estimado, o la tarde está llena."
			}) : proposals.map((item) => {
				const on = picked.includes(item.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPicked((list) => on ? list.filter((id) => id !== item.id) : [...list, item.id]),
					className: "mb-2 w-full text-left",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: on ? "border-sage" : "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-ink-soft",
							children: [
								prettyShort(item.date),
								" · ",
								item.start,
								"–",
								item.end,
								" · ",
								item.reason
							]
						})]
					})
				}, item.id);
			}), picked.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-2 w-full",
				onClick: () => {
					accept(proposals.filter((p) => picked.includes(p.id)));
					setPicked([]);
					toast.success("Sesiones agregadas. El resto del calendario no cambió.");
				},
				children: "Agregar seleccionadas"
			}) : null]
		})
	] });
}
function NotesScreen({ onOpen }) {
	const notes = useLife((s) => s.snap.notes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-end justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl leading-none",
			children: "Notas"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			variant: "soft",
			className: "min-h-10",
			onClick: () => onOpen({ kind: "nota" }),
			children: "Nueva"
		})]
	}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Sin notas",
		body: "Sirven para fórmulas, ideas y lo que no es una tarea."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2",
		children: notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-left",
			onClick: () => onOpen({
				kind: "nota",
				id: note.id
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "mb-2 size-4 text-sage" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: note.title || "Sin título"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2 text-sm text-ink-soft",
					children: note.content
				})
			] })
		}, note.id))
	})] });
}
function StatsScreen() {
	const stats = computeStats(useLife((s) => s.snap));
	const [Chart, setChart] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		import("../_libs/recharts+[...].mjs").then((n) => n.t).then(setChart);
	}, []);
	const max = Math.max(1, ...stats.weekBars.map((b) => b.minutos));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-2 font-display text-4xl leading-none",
			children: "Estadísticas"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-ink-soft",
			children: "Salen de tus registros. Si no hay actividad, el número es cero."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.tasksDone,
					label: "Tareas hechas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.tasksOnTime,
					label: "A tiempo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.tasksLate,
					label: "Tarde"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.tasksPending,
					label: "Pendientes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.tasksCancelled,
					label: "Canceladas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.examsUpcoming,
					label: "Exámenes por venir"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.focusMinutes,
					label: "Minutos de foco este mes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: stats.sessionsDone,
					label: "Sesiones cerradas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: `${stats.habitRate}%`,
					label: "Hábitos de la semana"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					n: `${stats.routineRate}%`,
					label: "Rutinas completas"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm text-ink-soft",
				children: "Minutos de foco, lunes a domingo"
			}), Chart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-36 w-full text-ink-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chart.BarChart, {
						data: stats.weekBars,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.XAxis, {
							dataKey: "d",
							tickLine: false,
							axisLine: false,
							tick: {
								fill: "currentColor",
								fontSize: 12
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chart.Bar, {
							dataKey: "minutos",
							fill: "var(--color-sage)",
							radius: [
								6,
								6,
								0,
								0
							]
						})]
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-28 items-end gap-2",
				children: stats.weekBars.map((bar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full rounded-t-lg bg-sage",
						style: { height: Math.round(bar.minutos / max * 88) }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-ink-soft",
						children: bar.d
					})]
				}, bar.d))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-ink-soft",
			children: [
				"Hábitos: ",
				stats.habitDone,
				" hechos, ",
				stats.habitSkipped,
				" omitidos, ",
				stats.habitMissed,
				" sin marcar en días que sí correspondían. Rutinas de esta semana: ",
				stats.routineDone,
				" de ",
				stats.routineScheduled,
				"."
			]
		})
	] });
}
function Stat({ n, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-3xl tabular-nums leading-none",
		children: n
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm text-ink-soft",
		children: label
	})] });
}
function SearchScreen({ onOpen, go }) {
	const snap = useLife((s) => s.snap);
	const [q, setQ] = (0, import_react.useState)("");
	const hits = searchAll(snap, q);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 font-display text-4xl leading-none",
			children: "Buscar"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: fieldClass,
			autoFocus: true,
			placeholder: "Tareas, materias, notas…",
			value: q,
			onChange: (e) => setQ(e.target.value)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 grid gap-2",
			children: [q.trim() && hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Nada con ese texto",
				body: "Revisá la ortografía o probá una palabra más corta."
			}) : null, hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-left",
				onClick: () => {
					if (hit.kind === "Tarea") onOpen({
						kind: "tarea",
						id: hit.id
					});
					else if (hit.kind === "Examen") onOpen({
						kind: "examen",
						id: hit.id
					});
					else if (hit.kind === "Evento") onOpen({
						kind: "evento",
						id: hit.id
					});
					else if (hit.kind === "Rutina") onOpen({
						kind: "rutina",
						id: hit.id
					});
					else if (hit.kind === "Hábito") onOpen({
						kind: "habito",
						id: hit.id
					});
					else if (hit.kind === "Nota") onOpen({
						kind: "nota",
						id: hit.id
					});
					else if (hit.kind === "Pendiente") onOpen({
						kind: "inbox",
						id: hit.id
					});
					else if (hit.kind === "Estudio") onOpen({
						kind: "sesion",
						id: hit.id
					});
					else {
						go("colegio");
						onOpen({
							kind: "materia",
							id: hit.id
						});
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-ink-soft",
						children: hit.kind
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: hit.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: hit.subtitle
					})
				] })
			}, `${hit.kind}:${hit.id}`))]
		})
	] });
}
function SettingsScreen() {
	const snap = useLife((s) => s.snap);
	const setPrefs = useLife((s) => s.setPrefs);
	const emptyAll = useLife((s) => s.emptyAll);
	const loadSample = useLife((s) => s.loadSample);
	const importSnap = useLife((s) => s.importSnap);
	const dismiss = useLife((s) => s.dismissNotice);
	const [perm, setPerm] = (0, import_react.useState)("");
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const [ios, setIos] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
		const { showLocalNotice } = await import("./notify-BRET0JcB.mjs");
		await showLocalNotice("LifeOS", "Este es un aviso de prueba en el dispositivo.", "hoy", `test-${newId()}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 font-display text-4xl leading-none",
			children: "Ajustes"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Tema",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					"sistema",
					"claro",
					"oscuro"
				].map((theme) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPrefs({ theme }),
					className: `min-h-11 rounded-2xl capitalize ${snap.prefs.theme === theme ? "bg-sage text-paper" : "border border-line bg-card"}`,
					children: theme
				}, theme))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Cómo te llamo",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				value: snap.prefs.displayName,
				placeholder: "Opcional",
				onChange: (e) => setPrefs({ displayName: e.target.value })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
			label: "Aviso nocturno para preparar mañana",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				type: "time",
				value: snap.prefs.nightReminder ?? "",
				onChange: (e) => setPrefs({ nightReminder: e.target.value || null })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Avisos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm text-ink-soft",
					children: [standalone ? "LifeOS está abierta como app, sin la barra de Safari." : "Estás en el navegador. En el iPhone, los avisos web piden la app en la pantalla de inicio.", ios ? " Detecté un iPhone o iPad." : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-3 text-sm",
					children: [
						"Estado del permiso: ",
						perm === "granted" ? "concedido" : perm === "denied" ? "bloqueado" : perm === "unsupported" ? "no disponible" : "todavía no pedido",
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						onClick: () => void enable(),
						children: "Activar notificaciones"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						onClick: () => void test(),
						disabled: perm !== "granted",
						children: "Probar aviso local"
					})]
				}),
				perm === "denied" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-ink-soft",
					children: "En el iPhone: Ajustes, Notificaciones, LifeOS. Si no aparece, la app no está instalada o el sistema no ofrece avisos web."
				}) : null,
				!standalone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Instalar en el iPhone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Abrí LifeOS en Safari." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tocá Compartir." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Elegí Agregar a inicio." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Abrila desde el ícono, no desde una pestaña." })
						]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: snap.notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-left",
						onClick: () => dismiss(notice.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: notice.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: notice.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-ink-soft",
								children: "Tocá para descartar"
							})
						] })
					}, notice.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Tus datos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-ink-soft",
					children: "Viven en este teléfono, en IndexedDB. No hay cuenta obligatoria. Exportá una copia si vas a borrar Safari."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "soft",
							onClick: () => download(snap),
							children: "Exportar copia"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex min-h-12 items-center justify-center rounded-2xl bg-card px-4 text-sage",
							children: ["Importar copia", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "application/json",
								className: "sr-only",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file) return;
									try {
										importSnap(normalizeImport(JSON.parse(await file.text())));
										toast.success("Copia restaurada en este teléfono.");
									} catch (error) {
										toast.error(error instanceof Error ? error.message : "No se pudo importar.");
									}
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "ghost",
							onClick: () => setConfirm("ejemplo"),
							children: "Cargar datos de ejemplo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "ghost",
							onClick: () => setConfirm("vacio"),
							children: "Vaciar todo"
						})
					]
				}),
				confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2",
						children: confirm === "vacio" ? "Se borra todo lo guardado en este teléfono." : "Se reemplaza lo actual por el ejemplo."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "clay",
							onClick: () => {
								if (confirm === "vacio") emptyAll();
								else loadSample();
								setConfirm(null);
							},
							children: "Confirmar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: "ghost",
							onClick: () => setConfirm(null),
							children: "Cancelar"
						})]
					})]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Qué puede y qué no",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-2 text-sm text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Los datos persisten en el dispositivo aunque cierres la app." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sin internet podés seguir viendo y editando lo ya cargado si la app llegó a abrirse publicada al menos una vez." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Un aviso con la app abierta no es lo mismo que una notificación push de un servidor, ni que una alarma de Reloj." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No hay servidor de push conectado: nadie puede enviarte un aviso con la pantalla bloqueada desde LifeOS." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "En iOS 16.4 o posterior, el push web solo existe para PWAs instaladas, con permiso, y con un servidor. Acá falta ese servidor a propósito, para no guardar tus suscripciones en un sitio público." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Si cambiás una fecha, el aviso pendiente se recalcula. Si completás o borrás, no se vuelve a disparar." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Una actualización publicada se aplica con el botón de la app, sin reinstalar el ícono." })
				]
			})
		})
	] });
}
function download(snap) {
	const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = `lifeos-${todayISO()}.json`;
	a.click();
	URL.revokeObjectURL(a.href);
}
var OFFSETS = [
	{
		m: 0,
		label: "A la hora"
	},
	{
		m: 30,
		label: "30 min"
	},
	{
		m: 120,
		label: "2 h"
	},
	{
		m: 1440,
		label: "1 día"
	}
];
var DAYS = [
	{
		d: 1,
		l: "L"
	},
	{
		d: 2,
		l: "M"
	},
	{
		d: 3,
		l: "X"
	},
	{
		d: 4,
		l: "J"
	},
	{
		d: 5,
		l: "V"
	},
	{
		d: 6,
		l: "S"
	},
	{
		d: 0,
		l: "D"
	}
];
function Offsets({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 flex flex-wrap gap-2",
		children: OFFSETS.map((o) => {
			const on = value.includes(o.m);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(on ? value.filter((m) => m !== o.m) : [...value, o.m]),
				className: `min-h-10 rounded-full px-3 text-sm ${on ? "bg-sage text-paper" : "bg-card text-ink border border-line"}`,
				"aria-pressed": on,
				children: o.label
			}, o.m);
		})
	});
}
function DayPicks({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 flex gap-1",
		children: DAYS.map((day) => {
			const on = value.includes(day.d);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(on ? value.filter((d) => d !== day.d) : [...value, day.d]),
				className: `grid size-11 place-items-center rounded-full text-sm ${on ? "bg-sage text-paper" : "bg-card border border-line"}`,
				"aria-pressed": on,
				children: day.l
			}, day.d);
		})
	});
}
function SubjectSelect({ value, onChange }) {
	const subjects = useLife((s) => s.snap.subjects);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		className: fieldClass,
		value: value ?? "",
		onChange: (e) => onChange(e.target.value),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: "Sin materia"
		}), subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: s.id,
			children: s.name
		}, s.id))]
	});
}
function EditorHost({ editor, onClose, onOpen }) {
	if (editor.kind === "rapido") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quick, {
		onClose,
		onOpen
	});
	if (editor.kind === "tarea") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskForm, {
		id: editor.id,
		compact: editor.compact,
		onClose
	});
	if (editor.kind === "examen") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExamForm, {
		id: editor.id,
		onClose
	});
	if (editor.kind === "evento") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventForm, {
		editor,
		onClose
	});
	if (editor.kind === "materia") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectForm, {
		id: editor.id,
		onClose
	});
	if (editor.kind === "bloque") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockForm, {
		id: editor.id,
		date: editor.date,
		onClose
	});
	if (editor.kind === "habito") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HabitForm, {
		id: editor.id,
		onClose
	});
	if (editor.kind === "rutina") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutineForm, {
		id: editor.id,
		onClose
	});
	if (editor.kind === "nota") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteForm, {
		id: editor.id,
		onClose
	});
	if (editor.kind === "inbox") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxForm, {
		id: editor.id,
		onClose
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionForm, {
		id: editor.id,
		onClose
	});
}
function Quick({ onClose, onOpen }) {
	const items = [
		{
			label: "Tarea",
			hint: "Título, materia y entrega",
			editor: {
				kind: "tarea",
				compact: true
			}
		},
		{
			label: "Evento",
			hint: "Algo en el calendario",
			editor: { kind: "evento" }
		},
		{
			label: "Recordatorio",
			hint: "Un aviso con hora",
			editor: {
				kind: "evento",
				date: todayISO()
			}
		},
		{
			label: "Examen",
			hint: "Fecha, materia y temas",
			editor: { kind: "examen" }
		},
		{
			label: "Hábito",
			hint: "Una constancia flexible",
			editor: { kind: "habito" }
		},
		{
			label: "Rutina",
			hint: "Pasos y horario",
			editor: { kind: "rutina" }
		},
		{
			label: "Nota",
			hint: "Para no olvidarlo",
			editor: { kind: "nota" }
		},
		{
			label: "Pendiente",
			hint: "Sin fecha, por ahora",
			editor: { kind: "inbox" }
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		title: "Nueva actividad",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen(item.editor),
				className: "min-h-20 rounded-card border border-line bg-card px-3 py-3 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-medium",
					children: item.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm text-ink-soft",
					children: item.hint
				})]
			}, item.label))
		})
	});
}
function TaskForm({ id, compact, onClose }) {
	const existing = useLife((s) => s.snap.tasks.find((t) => t.id === id));
	const upsert = useLife((s) => s.upsertTask);
	const remove = useLife((s) => s.deleteTask);
	const setStatus = useLife((s) => s.setTaskStatus);
	const [more, setMore] = (0, import_react.useState)(!compact);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [subjectId, setSubjectId] = (0, import_react.useState)(existing?.subjectId ?? "");
	const [dueDate, setDueDate] = (0, import_react.useState)(existing?.dueDate ?? "");
	const [dueTime, setDueTime] = (0, import_react.useState)(existing?.dueTime ?? "");
	const [description, setDescription] = (0, import_react.useState)(existing?.description ?? "");
	const [notes, setNotes] = (0, import_react.useState)(existing?.notes ?? "");
	const [importance, setImportance] = (0, import_react.useState)(existing?.importance ?? "media");
	const [urgencyMode, setUrgencyMode] = (0, import_react.useState)(existing?.urgencyMode ?? "auto");
	const [estimated, setEstimated] = (0, import_react.useState)(existing?.estimatedMinutes ? String(existing.estimatedMinutes) : "");
	const [offsets, setOffsets] = (0, import_react.useState)(existing?.reminderOffsets ?? (compact ? [1440] : []));
	const [pinned, setPinned] = (0, import_react.useState)(existing?.pinned ?? false);
	const [subtasks, setSubtasks] = (0, import_react.useState)(existing?.subtasks ?? []);
	const [sub, setSub] = (0, import_react.useState)("");
	const [attachments, setAttachments] = (0, import_react.useState)(existing?.attachments ?? []);
	const save = () => {
		if (!title.trim()) return;
		upsert(blankTask({
			...existing,
			id: existing?.id ?? newId(),
			title: title.trim(),
			subjectId: subjectId || void 0,
			dueDate: dueDate || void 0,
			dueTime: dueTime || void 0,
			description,
			notes,
			importance,
			urgencyMode,
			estimatedMinutes: estimated ? Number(estimated) : void 0,
			reminderOffsets: dueDate ? offsets : [],
			pinned,
			subtasks,
			attachments,
			createdAt: existing?.createdAt ?? (/* @__PURE__ */ new Date()).toISOString(),
			status: existing?.status ?? "pendiente"
		}));
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Tarea" : "Nueva tarea",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: save,
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Título",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Qué hay que hacer"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Materia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectSelect, {
					value: subjectId,
					onChange: setSubjectId
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Entrega",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "date",
						value: dueDate,
						onChange: (e) => setDueDate(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hora",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: dueTime,
						onChange: (e) => setDueTime(e.target.value)
					})
				})]
			}),
			!more ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mb-4 text-sm text-sage",
				onClick: () => setMore(true),
				children: "Más detalles"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Descripción",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} py-3`,
						rows: 3,
						value: description,
						onChange: (e) => setDescription(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Importancia",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							"baja",
							"media",
							"alta"
						].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setImportance(level),
							className: `min-h-11 rounded-2xl capitalize ${importance === level ? "bg-sage text-paper" : "bg-card border border-line"}`,
							children: level
						}, level))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Urgencia",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: fieldClass,
						value: urgencyMode,
						onChange: (e) => setUrgencyMode(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "auto",
								children: "Automática, según la fecha"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sin-apuro",
								children: "Sin apuro"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "proxima",
								children: "Próxima"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "hoy",
								children: "Para hoy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "vencida",
								children: "Vencida"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Minutos estimados",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						inputMode: "numeric",
						value: estimated,
						onChange: (e) => setEstimated(e.target.value.replace(/[^\d]/g, ""))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-sm text-ink-soft",
					children: "Recordatorios"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Offsets, {
					value: offsets,
					onChange: setOffsets
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mb-3 text-sm text-sage",
					onClick: () => setPinned((v) => !v),
					children: pinned ? "Fijada en hacé esto primero" : "Fijar en hacé esto primero"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notas",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						className: `${fieldClass} py-3`,
						rows: 2,
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm text-ink-soft",
					children: "Subtareas"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mb-2",
					children: subtasks.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex min-h-11 w-full items-center gap-2 text-left",
						onClick: () => setSubtasks((list) => list.map((x) => x.id === st.id ? {
							...x,
							done: !x.done
						} : x)),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-4 rounded-full border ${st.done ? "bg-sage border-sage" : "border-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: st.done ? "text-ink-soft line-through" : "",
							children: st.title
						})]
					}) }, st.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						value: sub,
						placeholder: "Nuevo paso",
						onChange: (e) => setSub(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
						variant: "soft",
						onClick: () => {
							if (!sub.trim()) return;
							setSubtasks((list) => [...list, {
								id: newId(),
								title: sub.trim(),
								done: false
							}]);
							setSub("");
						},
						children: "Sumar"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Adjunto (hasta 280 KB)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "block w-full text-sm",
						type: "file",
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (!file) return;
							if (file.size > 28e4) {
								toast.error("Ese archivo pesa más de 280 KB.");
								return;
							}
							const reader = new FileReader();
							reader.onload = () => {
								setAttachments((list) => [...list, {
									id: newId(),
									name: file.name,
									dataUrl: String(reader.result)
								}]);
							};
							reader.readAsDataURL(file);
						}
					})
				}),
				attachments.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "truncate text-sage",
						href: file.dataUrl,
						download: file.name,
						children: file.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-clay",
						onClick: () => setAttachments((list) => list.filter((f) => f.id !== file.id)),
						children: "Quitar"
					})]
				}, file.id))
			] }),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					onClick: () => {
						setStatus(existing.id, existing.status === "hecha" ? "pendiente" : "hecha");
						onClose();
					},
					children: existing.status === "hecha" ? "Reabrir" : "Marcar hecha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "ghost",
					onClick: () => {
						remove(existing.id);
						onClose();
					},
					children: "Eliminar"
				})]
			}) : null
		]
	});
}
function ExamForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.exams.find((e) => e.id === id));
	const upsert = useLife((s) => s.upsertExam);
	const remove = useLife((s) => s.deleteExam);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [subjectId, setSubjectId] = (0, import_react.useState)(existing?.subjectId ?? "");
	const [date, setDate] = (0, import_react.useState)(existing?.date ?? "");
	const [time, setTime] = (0, import_react.useState)(existing?.time ?? "");
	const [topics, setTopics] = (0, import_react.useState)(existing?.topics ?? "");
	const [notes, setNotes] = (0, import_react.useState)(existing?.notes ?? "");
	const [offsets, setOffsets] = (0, import_react.useState)(existing?.reminderOffsets ?? [1440]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Examen" : "Nuevo examen",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim() || !date) return;
				upsert(blankExam({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					subjectId: subjectId || void 0,
					date,
					time: time || void 0,
					topics,
					notes,
					reminderOffsets: offsets
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Materia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectSelect, {
					value: subjectId,
					onChange: setSubjectId
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Fecha",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hora",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: time,
						onChange: (e) => setTime(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Temas",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 3,
					value: topics,
					onChange: (e) => setTopics(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notas",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 2,
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-sm text-ink-soft",
				children: "Recordatorios"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Offsets, {
				value: offsets,
				onChange: setOffsets
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function EventForm({ editor, onClose }) {
	const existing = useLife((s) => s.snap.events.find((e) => e.id === editor.id));
	const upsert = useLife((s) => s.upsertEvent);
	const override = useLife((s) => s.overrideEventOn);
	const occurrence = editor.scope === "dia" && editor.date && existing ? eventView(existing, editor.date) : null;
	const [title, setTitle] = (0, import_react.useState)(occurrence?.title ?? existing?.title ?? (editor.date && !editor.id ? "Recordatorio" : ""));
	const [date, setDate] = (0, import_react.useState)(editor.date ?? existing?.date ?? todayISO());
	const [time, setTime] = (0, import_react.useState)(occurrence?.time ?? existing?.time ?? "");
	const [endTime, setEndTime] = (0, import_react.useState)(occurrence?.endTime ?? existing?.endTime ?? "");
	const [description, setDescription] = (0, import_react.useState)(occurrence?.description ?? existing?.description ?? "");
	const [category, setCategory] = (0, import_react.useState)(occurrence?.category ?? existing?.category ?? (editor.date && !editor.id ? "Recordatorio" : "Personal"));
	const [importance, setImportance] = (0, import_react.useState)(occurrence?.importance ?? existing?.importance ?? "media");
	const [offsets, setOffsets] = (0, import_react.useState)(existing?.reminderOffsets ?? (category === "Recordatorio" ? [0] : []));
	const [freq, setFreq] = (0, import_react.useState)(existing?.recurrence?.freq ?? "none");
	const [interval, setInterval] = (0, import_react.useState)(String(existing?.recurrence?.interval ?? 1));
	const [days, setDays] = (0, import_react.useState)(existing?.recurrence?.days ?? []);
	const [until, setUntil] = (0, import_react.useState)(existing?.recurrence?.until ?? "");
	const oneDay = editor.scope === "dia" && existing && editor.date;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: oneDay ? "Solo este día" : existing ? "Evento" : "Nuevo evento",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim() || !date) return;
				if (oneDay && existing && editor.date) {
					override(existing.id, editor.date, {
						date: editor.date,
						type: "override",
						title: title.trim(),
						time: time || void 0,
						endTime: endTime || void 0,
						description,
						category,
						importance
					});
					onClose();
					return;
				}
				upsert(blankEvent({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					date,
					time: time || void 0,
					endTime: endTime || void 0,
					description,
					category,
					importance,
					reminderOffsets: offsets,
					recurrence: freq === "none" ? null : {
						freq,
						interval: Math.max(1, Number(interval) || 1),
						days: freq === "weekly" ? days : [],
						until: until || void 0
					},
					exceptions: existing?.exceptions ?? []
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			oneDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 text-sm text-ink-soft",
				children: [
					"La serie queda igual. Esto cambia únicamente el ",
					editor.date,
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			!oneDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Fecha",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value)
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Empieza",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: time,
						onChange: (e) => setTime(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Termina",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: endTime,
						onChange: (e) => setEndTime(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Categoría",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: fieldClass,
					value: category,
					onChange: (e) => setCategory(e.target.value),
					children: [
						"Personal",
						"Colegio",
						"Estudio",
						"Salud",
						"Deporte",
						"Recordatorio"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Importancia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: importance,
					onChange: (e) => setImportance(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "baja",
							children: "Baja"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "media",
							children: "Media"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "alta",
							children: "Alta"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Descripción",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 3,
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-sm text-ink-soft",
				children: "Recordatorios"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Offsets, {
				value: offsets,
				onChange: setOffsets
			}),
			!oneDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Repetición",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: fieldClass,
						value: freq,
						onChange: (e) => setFreq(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "No se repite"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "daily",
								children: "Todos los días"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "weekly",
								children: "Por semana"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "monthly",
								children: "Por mes"
							})
						]
					})
				}),
				freq !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Cada cuántos",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						inputMode: "numeric",
						value: interval,
						onChange: (e) => setInterval(e.target.value.replace(/[^\d]/g, ""))
					})
				}) : null,
				freq === "weekly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicks, {
					value: days,
					onChange: setDays
				}) : null,
				freq !== "none" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hasta",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "date",
						value: until,
						onChange: (e) => setUntil(e.target.value)
					})
				}) : null
			] }) : null
		]
	});
}
function SubjectForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.subjects.find((x) => x.id === id));
	const upsert = useLife((s) => s.upsertSubject);
	const remove = useLife((s) => s.deleteSubject);
	const [name, setName] = (0, import_react.useState)(existing?.name ?? "");
	const [teacher, setTeacher] = (0, import_react.useState)(existing?.teacher ?? "");
	const [room, setRoom] = (0, import_react.useState)(existing?.room ?? "");
	const [notes, setNotes] = (0, import_react.useState)(existing?.notes ?? "");
	const [tone, setTone] = (0, import_react.useState)(existing?.tone ?? "sage");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Materia" : "Nueva materia",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!name.trim()) return;
				upsert(blankSubject({
					...existing,
					id: existing?.id ?? newId(),
					name: name.trim(),
					teacher,
					room,
					notes,
					tone
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Profesor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: teacher,
					onChange: (e) => setTeacher(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Aula",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: room,
					onChange: (e) => setRoom(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Color",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						"sage",
						"clay",
						"ink"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTone(t),
						className: `min-h-11 rounded-2xl capitalize ${tone === t ? "bg-sage text-paper" : "border border-line bg-card"}`,
						children: t === "sage" ? "Salvia" : t === "clay" ? "Arcilla" : "Tinta"
					}, t))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notas",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 2,
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar materia"
			}) : null
		]
	});
}
function BlockForm({ id, date, onClose }) {
	const existing = useLife((s) => s.snap.blocks.find((b) => b.id === id));
	const upsert = useLife((s) => s.upsertBlock);
	const remove = useLife((s) => s.deleteBlock);
	const cancel = useLife((s) => s.cancelBlockOn);
	const [subjectId, setSubjectId] = (0, import_react.useState)(existing?.subjectId ?? "");
	const [dayOfWeek, setDayOfWeek] = (0, import_react.useState)(existing?.dayOfWeek ?? 1);
	const [start, setStart] = (0, import_react.useState)(existing?.start ?? "07:10");
	const [end, setEnd] = (0, import_react.useState)(existing?.end ?? "08:00");
	const [room, setRoom] = (0, import_react.useState)(existing?.room ?? "");
	const [scope, setScope] = (0, import_react.useState)(existing?.scope ?? "regular");
	const [onceDate, setOnceDate] = (0, import_react.useState)(existing?.date ?? date ?? todayISO());
	const save = (asOnce) => {
		if (!subjectId || start >= end) return;
		if (asOnce && existing && date) {
			const block = {
				id: newId(),
				subjectId,
				dayOfWeek,
				start,
				end,
				room,
				scope: "once",
				date,
				replacesId: existing.scope === "regular" ? existing.id : void 0
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
			date: scope === "once" ? onceDate : void 0,
			replacesId: existing?.replacesId,
			cancelOf: existing?.cancelOf
		});
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Horario",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => save(false),
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Materia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectSelect, {
					value: subjectId,
					onChange: setSubjectId
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Alcance",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: scope,
					onChange: (e) => setScope(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "regular",
						children: "Todas las semanas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "once",
						children: "Solo una fecha"
					})]
				})
			}),
			scope === "regular" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Día",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: fieldClass,
					value: dayOfWeek,
					onChange: (e) => setDayOfWeek(Number(e.target.value)),
					children: DAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: d.d,
						children: d.l
					}, d.d))
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Fecha",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					type: "date",
					value: onceDate,
					onChange: (e) => setOnceDate(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Desde",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: start,
						onChange: (e) => setStart(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hasta",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: end,
						onChange: (e) => setEnd(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Aula",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: room,
					onChange: (e) => setRoom(e.target.value)
				})
			}),
			existing && date && existing.scope === "regular" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					onClick: () => save(true),
					children: "Cambiar solo este día"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "ghost",
					onClick: () => {
						cancel(existing.id, date);
						onClose();
					},
					children: "Quitar solo este día"
				})]
			}) : null,
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-3",
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar del horario"
			}) : null
		]
	});
}
function HabitForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.habits.find((h) => h.id === id));
	const upsert = useLife((s) => s.upsertHabit);
	const remove = useLife((s) => s.deleteHabit);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [kind, setKind] = (0, import_react.useState)(existing?.freq.kind ?? "daily");
	const [days, setDays] = (0, import_react.useState)(existing?.freq.kind === "daily" ? existing.freq.days : [
		1,
		2,
		3,
		4,
		5
	]);
	const [target, setTarget] = (0, import_react.useState)(existing && existing.freq.kind !== "daily" ? String(existing.freq.target) : "4");
	const [tone, setTone] = (0, import_react.useState)(existing?.tone ?? "sage");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Hábito" : "Nuevo hábito",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim()) return;
				const freq = kind === "daily" ? {
					kind,
					days
				} : {
					kind,
					target: Math.max(1, Number(target) || 1)
				};
				upsert(blankHabit({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					freq,
					tone
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Frecuencia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: kind,
					onChange: (e) => setKind(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "daily",
							children: "Días elegidos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "weekly",
							children: "Veces por semana"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "monthly",
							children: "Veces por mes"
						})
					]
				})
			}),
			kind === "daily" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicks, {
				value: days,
				onChange: setDays
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Objetivo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					inputMode: "numeric",
					value: target,
					onChange: (e) => setTarget(e.target.value.replace(/[^\d]/g, ""))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-ink-soft",
				children: "Los días que no marcaste no cuentan como fallo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					"sage",
					"clay",
					"ink"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTone(t),
					className: `min-h-11 rounded-2xl ${tone === t ? "bg-sage text-paper" : "border border-line bg-card"}`,
					children: t === "sage" ? "Salvia" : t === "clay" ? "Arcilla" : "Tinta"
				}, t))
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-4",
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function RoutineForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.routines.find((r) => r.id === id));
	const upsert = useLife((s) => s.upsertRoutine);
	const remove = useLife((s) => s.deleteRoutine);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [time, setTime] = (0, import_react.useState)(existing?.time ?? "07:00");
	const [duration, setDuration] = (0, import_react.useState)(String(existing?.durationMin ?? 20));
	const [days, setDays] = (0, import_react.useState)(existing?.days ?? [
		1,
		2,
		3,
		4,
		5
	]);
	const [steps, setSteps] = (0, import_react.useState)(existing?.steps ?? []);
	const [step, setStep] = (0, import_react.useState)("");
	const [offsets, setOffsets] = (0, import_react.useState)(existing?.reminderOffsets ?? [0]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Rutina" : "Nueva rutina",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim()) return;
				upsert(blankRoutine({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					time,
					durationMin: Number(duration) || 20,
					days,
					steps,
					reminderOffsets: offsets,
					paused: existing?.paused ?? false
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hora",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: time,
						onChange: (e) => setTime(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Minutos",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						inputMode: "numeric",
						value: duration,
						onChange: (e) => setDuration(e.target.value.replace(/[^\d]/g, ""))
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-sm text-ink-soft",
				children: "Días"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DayPicks, {
				value: days,
				onChange: setDays
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-sm text-ink-soft",
				children: "Aviso"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Offsets, {
				value: offsets,
				onChange: setOffsets
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm text-clay",
				children: "Un aviso no es una alarma del reloj. Si el iPhone está bloqueado, LifeOS no puede garantizar que suene."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm text-ink-soft",
				children: "Pasos"
			}),
			steps.map((s, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: s.title,
					onChange: (e) => setSteps((list) => list.map((x) => x.id === s.id ? {
						...x,
						title: e.target.value
					} : x))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-clay",
					onClick: () => setSteps((list) => list.filter((_, i) => i !== index)),
					children: "Quitar"
				})]
			}, s.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: step,
					placeholder: "Nuevo paso",
					onChange: (e) => setStep(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					variant: "soft",
					onClick: () => {
						if (!step.trim()) return;
						setSteps((list) => [...list, {
							id: newId(),
							title: step.trim()
						}]);
						setStep("");
					},
					children: "Sumar"
				})]
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				className: "mt-4",
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function NoteForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.notes.find((n) => n.id === id));
	const upsert = useLife((s) => s.upsertNote);
	const remove = useLife((s) => s.deleteNote);
	const subjects = useLife((s) => s.snap.subjects);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [content, setContent] = (0, import_react.useState)(existing?.content ?? "");
	const [category, setCategory] = (0, import_react.useState)(existing?.category ?? "");
	const [tags, setTags] = (0, import_react.useState)(existing?.tags.join(", ") ?? "");
	const [link, setLink] = (0, import_react.useState)(existing?.links[0]?.id ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Nota" : "Nueva nota",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim() && !content.trim()) return;
				upsert(blankNote({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					content,
					category,
					tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
					links: link ? [{
						kind: "materia",
						id: link
					}] : []
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Título",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nota",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 6,
					value: content,
					onChange: (e) => setContent(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Categoría",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: category,
					onChange: (e) => setCategory(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Etiquetas, separadas por coma",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: tags,
					onChange: (e) => setTags(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Vincular a una materia",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: link,
					onChange: (e) => setLink(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Sin vínculo"
					}), subjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))]
				})
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function InboxForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.inbox.find((i) => i.id === id));
	const upsert = useLife((s) => s.upsertInbox);
	const remove = useLife((s) => s.deleteInbox);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [notes, setNotes] = (0, import_react.useState)(existing?.notes ?? "");
	const [category, setCategory] = (0, import_react.useState)(existing?.category ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Pendiente" : "Nuevo pendiente",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim()) return;
				upsert(blankInbox({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					notes,
					category,
					archived: existing?.archived ?? false
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Qué se te ocurrió",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notas",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: `${fieldClass} py-3`,
					rows: 3,
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Categoría",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: category,
					onChange: (e) => setCategory(e.target.value)
				})
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function SessionForm({ id, onClose }) {
	const existing = useLife((s) => s.snap.sessions.find((s) => s.id === id));
	const tasks = useLife((s) => s.snap.tasks);
	const exams = useLife((s) => s.snap.exams);
	const upsert = useLife((s) => s.upsertSession);
	const remove = useLife((s) => s.deleteSession);
	const [title, setTitle] = (0, import_react.useState)(existing?.title ?? "");
	const [date, setDate] = (0, import_react.useState)(existing?.date ?? todayISO());
	const [start, setStart] = (0, import_react.useState)(existing?.start ?? "16:00");
	const [minutes, setMinutes] = (0, import_react.useState)(String(existing?.plannedMinutes ?? 40));
	const [taskId, setTaskId] = (0, import_react.useState)(existing?.taskId ?? "");
	const [examId, setExamId] = (0, import_react.useState)(existing?.examId ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: existing ? "Sesión" : "Sesión de estudio",
		onClose,
		footer: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
			className: "w-full",
			onClick: () => {
				if (!title.trim() || !date) return;
				upsert(blankSession({
					...existing,
					id: existing?.id ?? newId(),
					title: title.trim(),
					date,
					start: start || void 0,
					plannedMinutes: Number(minutes) || 25,
					taskId: taskId || void 0,
					examId: examId || void 0,
					subjectId: tasks.find((t) => t.id === taskId)?.subjectId || exams.find((e) => e.id === examId)?.subjectId,
					status: existing?.status ?? "planificada",
					focusMinutes: existing?.focusMinutes ?? 0
				}));
				onClose();
			},
			children: "Guardar"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Título",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					value: title,
					onChange: (e) => setTitle(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Día",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "date",
						value: date,
						onChange: (e) => setDate(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hora",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: fieldClass,
						type: "time",
						value: start,
						onChange: (e) => setStart(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Minutos",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass,
					inputMode: "numeric",
					value: minutes,
					onChange: (e) => setMinutes(e.target.value.replace(/[^\d]/g, ""))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tarea",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: taskId,
					onChange: (e) => setTaskId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Ninguna"
					}), tasks.filter((t) => t.status === "pendiente").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.title
					}, t.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Examen",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass,
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Ninguno"
					}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						children: e.title
					}, e.id))]
				})
			}),
			existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "ghost",
				onClick: () => {
					remove(existing.id);
					onClose();
				},
				children: "Eliminar"
			}) : null
		]
	});
}
function School({ onOpen }) {
	const snap = useLife((s) => s.snap);
	const setStatus = useLife((s) => s.setTaskStatus);
	const [tab, setTab] = (0, import_react.useState)("horario");
	const [filter, setFilter] = (0, import_react.useState)("pendientes");
	const today = todayISO();
	const [day, setDay] = (0, import_react.useState)(today);
	const week = startOfWeek(today);
	const tasks = snap.tasks.filter((t) => filter === "todas" ? true : filter === "hechas" ? t.status === "hecha" : t.status === "pendiente");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 font-display text-4xl leading-none",
			children: "Colegio"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: tab,
			onChange: setTab,
			options: [
				{
					id: "horario",
					label: "Horario"
				},
				{
					id: "tareas",
					label: "Tareas"
				},
				{
					id: "examenes",
					label: "Exámenes"
				},
				{
					id: "materias",
					label: "Materias"
				}
			]
		}),
		tab === "horario" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-1 overflow-x-auto",
			children: Array.from({ length: 7 }, (_, i) => {
				const date = addDays(week, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setDay(date),
					className: `min-h-14 min-w-12 rounded-2xl px-2 ${date === day ? "bg-sage text-paper" : "bg-card border border-line"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs",
						children: WEEKDAY_NAME[(/* @__PURE__ */ new Date(`${date}T12:00:00`)).getDay()]?.slice(0, 2)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: date.slice(8)
					})]
				}, date);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: day === today ? "Hoy" : prettyShort(day),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				variant: "soft",
				className: "min-h-10 px-3",
				onClick: () => onOpen({
					kind: "bloque",
					date: day
				}),
				children: "Agregar"
			}),
			children: classesOn(snap.blocks, day).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Sin clases",
				body: "Este día no tiene horario. Podés sumar un bloque o un cambio temporal."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: classesOn(snap.blocks, day).map((block) => {
					const subject = snap.subjects.find((s) => s.id === block.subjectId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-left",
						onClick: () => onOpen({
							kind: "bloque",
							id: block.id,
							date: day
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1 h-10 w-1.5 rounded-full ${subject?.tone === "clay" ? "bg-clay" : subject?.tone === "ink" ? "bg-ink" : "bg-sage"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: subject?.name ?? "Clase"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-sm text-ink-soft",
								children: [
									block.start,
									"–",
									block.end,
									block.scope === "once" ? " · cambio de este día" : "",
									block.room ? ` · ${block.room}` : ""
								]
							})] })]
						})
					}, block.id);
				})
			})
		})] }) : null,
		tab === "tareas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				value: filter,
				onChange: setFilter,
				options: [
					{
						id: "pendientes",
						label: "Pendientes"
					},
					{
						id: "hechas",
						label: "Hechas"
					},
					{
						id: "todas",
						label: "Todas"
					}
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: () => onOpen({ kind: "tarea" }),
					children: "Nueva tarea"
				})
			}),
			tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "No hay tareas acá",
				body: "Las que cargues se guardan en este teléfono."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckButton, {
						done: task.status === "hecha",
						label: `Estado de ${task.title}`,
						onClick: () => setStatus(task.id, task.status === "hecha" ? "pendiente" : "hecha")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 flex-1 text-left",
						onClick: () => onOpen({
							kind: "tarea",
							id: task.id
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: task.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm text-ink-soft",
							children: [
								subjectName(snap, task.subjectId) || "Personal",
								task.dueDate ? ` · ${prettyShort(task.dueDate)}` : "",
								task.status === "pendiente" ? ` · ${urgencyOf(task, today).replace("-", " ")}` : task.status === "cancelada" ? " · cancelada" : ""
							]
						})]
					})]
				}, task.id))
			})
		] }) : null,
		tab === "examenes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				onClick: () => onOpen({ kind: "examen" }),
				children: "Nuevo examen"
			})
		}), snap.exams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Sin exámenes",
			body: "Cuando agregues uno, vas a poder armar sesiones de estudio."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: snap.exams.map((exam) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-left",
				onClick: () => onOpen({
					kind: "examen",
					id: exam.id
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(snap.subjects.find((s) => s.id === exam.subjectId)?.tone ?? "clay")}`,
						children: subjectName(snap, exam.subjectId) || "Examen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: exam.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink-soft",
						children: [prettyShort(exam.date), exam.time ? ` · ${exam.time}` : ""]
					}),
					exam.topics ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: exam.topics
					}) : null
				] })
			}, exam.id))
		})] }) : null,
		tab === "materias" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				onClick: () => onOpen({ kind: "materia" }),
				children: "Nueva materia"
			})
		}), snap.subjects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Todavía no hay materias",
			body: "Sumá la primera y después armá el horario."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: snap.subjects.map((subject) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-left",
				onClick: () => onOpen({
					kind: "materia",
					id: subject.id
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(subject.tone)}`,
						children: subject.room || "Sin aula"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: subject.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: subject.teacher || "Sin profesor"
					})
				] })
			}, subject.id))
		})] }) : null
	] });
}
function Today({ onOpen, go }) {
	const snap = useLife((s) => s.snap);
	const setStatus = useLife((s) => s.setTaskStatus);
	const markHabit = useLife((s) => s.markHabit);
	const toggleStep = useLife((s) => s.toggleStep);
	const setPrefs = useLife((s) => s.setPrefs);
	const today = todayISO();
	const progress = dayProgress(snap, today);
	const tops = priorities(snap, today);
	const upcoming = nextClass(snap);
	const items = agendaOn(snap, today).filter((item) => item.source !== "tarea");
	const due = snap.tasks.filter((t) => t.status === "pendiente" && t.dueDate && t.dueDate <= today && !tops.some((p) => p.kind === "tarea" && p.id === t.id));
	const habits = snap.habits.filter((h) => h.freq.kind !== "daily" || isDailyScheduled(h, today));
	const routines = snap.routines.filter((r) => !r.paused && r.days.includes((/* @__PURE__ */ new Date()).getDay()));
	const name = snap.prefs.displayName.trim();
	const pct = progress.total ? Math.round(progress.done / progress.total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-5 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: name ? `Hola, ${name}` : "LifeOS"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-none",
				children: prettyDate(today)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "grid size-11 place-items-center",
					"aria-label": "Buscar",
					onClick: () => go("buscar"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "relative grid size-11 place-items-center",
					"aria-label": "Avisos",
					onClick: () => go("ajustes"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), snap.notices.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 size-2 rounded-full bg-clay" }) : null]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Progreso de hoy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "tabular-nums text-sm",
					children: progress.total ? `${progress.done} de ${progress.total}` : "Nada obligatorio"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-sage",
					style: { width: `${pct}%` }
				})
			})]
		}),
		snap.prefs.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "Datos de ejemplo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-ink-soft",
					children: "Podés editarlos o vaciarlos cuando quieras empezar con lo tuyo."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 text-sm text-sage",
					onClick: () => setPrefs({ sample: false }),
					children: "Entendido, dejarlos"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Hacé esto primero",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm text-ink-soft",
				children: "Tres sugerencias. No muevo nada si no me lo pedís."
			}), tops.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "No hay urgencias",
				body: "Cuando cargues una tarea o un examen, van a aparecer acá."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: tops.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center gap-2",
					children: [item.kind === "tarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckButton, {
						done: false,
						label: `Completar ${item.title}`,
						onClick: () => setStatus(item.id, "hecha")
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center font-display text-xl text-sage",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 flex-1 text-left",
						onClick: () => onOpen(item.kind === "tarea" ? {
							kind: "tarea",
							id: item.id
						} : {
							kind: "examen",
							id: item.id
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm text-ink-soft",
							children: item.reason
						})]
					})]
				}, item.key))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: upcoming?.live ? "Estás en clase" : "Próxima clase",
			children: upcoming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "w-full text-left",
				onClick: () => onOpen({
					kind: "bloque",
					id: upcoming.block.id,
					date: upcoming.date
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mb-2 inline-flex rounded-full px-2 py-1 text-xs ${toneClass(upcoming.subject?.tone ?? "ink")}`,
						children: upcoming.date === today ? "Hoy" : prettyShort(upcoming.date)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl leading-none",
						children: upcoming.subject?.name ?? "Clase"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-ink-soft",
						children: [
							upcoming.block.start,
							"–",
							upcoming.block.end,
							upcoming.block.room || upcoming.subject?.room ? ` · ${upcoming.block.room || upcoming.subject?.room}` : "",
							upcoming.subject?.teacher ? ` · ${upcoming.subject.teacher}` : ""
						]
					})
				] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Sin clases a la vista",
				body: "Cargá materias y horarios en Colegio.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-sage",
					onClick: () => go("colegio"),
					children: "Ir a Colegio"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Hoy",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Día despejado",
				body: "No hay clases, eventos ni rutinas para hoy."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-2",
				children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "w-12 shrink-0 tabular-nums text-sm text-ink-soft",
						children: item.start ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: item.detail
					})] })]
				}) }, item.key))
			})
		}),
		due.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "También pendiente",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: due.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckButton, {
						done: false,
						label: `Completar ${task.title}`,
						onClick: () => setStatus(task.id, "hecha")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-h-11 flex-1 text-left",
						onClick: () => onOpen({
							kind: "tarea",
							id: task.id
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: task.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-sm text-ink-soft",
							children: [task.dueDate && task.dueDate < today ? "Vencida" : "Para hoy", task.subjectId ? ` · ${subjectName(snap, task.subjectId)}` : ""]
						})]
					})]
				}, task.id))
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Hábitos",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-sage",
				onClick: () => go("vida"),
				children: "Ver todos"
			}),
			children: habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Sin hábitos para hoy",
				body: "Los de días que no elegiste no aparecen, y no cuentan como fallo."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: habits.map((habit) => {
					const mark = habitMark(snap.habitLogs, habit.id, today);
					const count = periodCount(habit, snap.habitLogs, today);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckButton, {
							done: mark === "hecho",
							label: mark === "hecho" ? `Desmarcar ${habit.title}` : `Completar ${habit.title}`,
							onClick: () => markHabit(habit.id, today, mark === "hecho" ? null : "hecho")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-h-11 flex-1 text-left",
							onClick: () => onOpen({
								kind: "habito",
								id: habit.id
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: habit.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-ink-soft",
								children: habit.freq.kind === "daily" ? mark === "omitido" ? "Omitido" : mark === "na" ? "No aplica" : "Hoy" : `${count.done} de ${count.target} esta ${habit.freq.kind === "weekly" ? "semana" : "mes"}`
							})]
						})]
					}, habit.id);
				})
			})
		}),
		routines.map((routine) => {
			const log = snap.routineLogs.find((l) => l.routineId === routine.id && l.date === today);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: routine.title,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-sage",
					onClick: () => onOpen({
						kind: "rutina",
						id: routine.id
					}),
					children: "Editar"
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm text-ink-soft",
					children: [
						routine.time,
						" · ",
						routine.durationMin,
						" min"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1",
					children: routine.steps.map((step) => {
						const done = log?.doneSteps.includes(step.id) ?? false;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-11 items-center gap-3 text-left",
							onClick: () => toggleStep(routine.id, today, step.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-4 rounded-full border ${done ? "border-sage bg-sage" : "border-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: done ? "text-ink-soft line-through" : "",
								children: step.title
							})]
						}, step.id);
					})
				})]
			}, routine.id);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mb-2 w-full text-left",
			onClick: () => go("manana"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "Preparar mañana"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: prettyShort(addDays(today, 1))
			})] })
		})
	] });
}
function Vida({ onOpen }) {
	const snap = useLife((s) => s.snap);
	const mark = useLife((s) => s.markHabit);
	const togglePause = useLife((s) => s.toggleRoutinePause);
	const toggleStep = useLife((s) => s.toggleStep);
	const [tab, setTab] = (0, import_react.useState)("habitos");
	const today = todayISO();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-4 font-display text-4xl leading-none",
			children: "Vida"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
			value: tab,
			onChange: setTab,
			options: [{
				id: "habitos",
				label: "Hábitos"
			}, {
				id: "rutinas",
				label: "Rutinas"
			}]
		}),
		tab === "habitos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				onClick: () => onOpen({ kind: "habito" }),
				children: "Nuevo hábito"
			})
		}), snap.habits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "Sin hábitos",
			body: "Podés pedir cuatro veces por semana, o solo algunos días. El resto no se cuenta como falta."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: snap.habits.map((habit) => {
				const current = habitMark(snap.habitLogs, habit.id, today);
				const count = periodCount(habit, snap.habitLogs, today);
				const streak = habitStreak(habit, snap.habitLogs, today);
				const set = (next) => mark(habit.id, today, current === next ? null : next);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-full text-left",
					onClick: () => onOpen({
						kind: "habito",
						id: habit.id
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: habit.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-ink-soft",
						children: [habit.freq.kind === "daily" ? "Días elegidos" : `${count.done} de ${count.target}`, streak ? ` · racha ${streak}` : ""]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
							label: "Hecho",
							on: current === "hecho",
							onClick: () => set("hecho")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
							label: "Omitir",
							on: current === "omitido",
							onClick: () => set("omitido")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {
							label: "No aplica",
							on: current === "na",
							onClick: () => set("na")
						})
					]
				})] }, habit.id);
			})
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: () => onOpen({ kind: "rutina" }),
					children: "Nueva rutina"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-ink-soft",
				children: "El aviso llega si LifeOS está abierta o si el sistema lo permite. No reemplaza la alarma del iPhone."
			}),
			snap.routines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				title: "Sin rutinas",
				body: "Una rutina es una lista de pasos con hora y días."
			}) : snap.routines.map((routine) => {
				const log = routineLog(snap.routineLogs, routine.id, today);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: routine.title,
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-sage",
						onClick: () => onOpen({
							kind: "rutina",
							id: routine.id
						}),
						children: "Editar"
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-2 text-sm text-ink-soft",
							children: [
								routine.time,
								" · ",
								routine.durationMin,
								" min ",
								routine.paused ? "· en pausa" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
								variant: "soft",
								className: "min-h-10",
								onClick: () => togglePause(routine.id),
								children: routine.paused ? "Reanudar" : "Pausar"
							})
						}),
						routine.steps.map((step) => {
							const done = log?.doneSteps.includes(step.id) ?? false;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center gap-3 text-left",
								onClick: () => toggleStep(routine.id, today, step.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-4 rounded-full border ${done ? "bg-sage border-sage" : "border-line"}` }), step.title]
							}, step.id);
						})
					]
				}, routine.id);
			})
		] })
	] });
}
function Mark({ label, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `min-h-11 rounded-2xl text-sm ${on ? "bg-sage text-paper" : "border border-line bg-card"}`,
		"aria-pressed": on,
		children: label
	});
}
var NAV = [
	{
		id: "hoy",
		label: "Hoy",
		icon: House
	},
	{
		id: "colegio",
		label: "Colegio",
		icon: GraduationCap
	},
	{
		id: "agenda",
		label: "Agenda",
		icon: Calendar
	},
	{
		id: "vida",
		label: "Vida",
		icon: Leaf
	},
	{
		id: "mas",
		label: "Más",
		icon: Ellipsis
	}
];
function readView() {
	if (typeof window === "undefined") return "hoy";
	const id = window.location.hash.replace("#", "");
	return VIEW_IDS.includes(id) ? id : "hoy";
}
function LifeApp() {
	const ready = useLife((s) => s.ready);
	const init = useLife((s) => s.init);
	const theme = useLife((s) => s.snap.prefs.theme);
	const notice = useLife((s) => s.snap.notices[0]);
	const dismiss = useLife((s) => s.dismissNotice);
	const [view, setView] = (0, import_react.useState)("hoy");
	const [editor, setEditor] = (0, import_react.useState)(null);
	const [updateReady, setUpdateReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		init();
	}, [init]);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		if (theme === "claro") root.classList.add("light");
		if (theme === "oscuro") root.classList.add("dark");
	}, [theme]);
	(0, import_react.useEffect)(() => {
		const apply = () => setView(readView());
		apply();
		window.addEventListener("hashchange", apply);
		return () => window.removeEventListener("hashchange", apply);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const flush = () => useLife.getState().flushReminders();
		flush();
		const id = window.setInterval(flush, 3e4);
		return () => window.clearInterval(id);
	}, [ready]);
	(0, import_react.useEffect)(() => {
		if (!("serviceWorker" in navigator)) return;
		let gone = false;
		const onController = () => {
			if (sessionStorage.getItem("lifeos-update") === "1") {
				sessionStorage.removeItem("lifeos-update");
				window.location.reload();
			}
		};
		navigator.serviceWorker.addEventListener("controllerchange", onController);
		navigator.serviceWorker.register("/lifeos-sw.js").then((reg) => {
			const look = () => {
				if (!gone && reg.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
			};
			reg.addEventListener("updatefound", () => {
				reg.installing?.addEventListener("statechange", look);
			});
			reg.update().catch(() => void 0);
			look();
		});
		return () => {
			gone = true;
			navigator.serviceWorker.removeEventListener("controllerchange", onController);
		};
	}, []);
	const go = (next) => {
		setView(next);
		const url = `${window.location.pathname}${window.location.search}#${next}`;
		window.history.replaceState(null, "", url);
	};
	const showFab = [
		"hoy",
		"colegio",
		"agenda",
		"vida",
		"pendientes",
		"notas"
	].includes(view);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto min-h-screen w-full max-w-lg md:border-x md:border-line",
				children: !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-screen flex-col justify-end px-6 pb-safe pt-safe",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-5xl leading-none",
						children: "LifeOS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-ink-soft",
						children: "Tu día, en orden."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					updateReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 pt-safe",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 w-full rounded-2xl bg-sage px-4 py-3 text-left text-paper",
							onClick: () => {
								sessionStorage.setItem("lifeos-update", "1");
								navigator.serviceWorker.getRegistration().then((reg) => reg?.waiting?.postMessage("skip-waiting"));
							},
							children: "Hay una versión nueva. Tocá para aplicarla sin reinstalar."
						})
					}) : null,
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `px-4 ${updateReady ? "pt-2" : "pt-safe"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-2 w-full rounded-2xl bg-clay-soft px-4 py-3 text-left",
							onClick: () => {
								go(notice.view);
								dismiss(notice.id);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-ink-soft",
								children: "Aviso con la app abierta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block",
								children: notice.body
							})]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: `px-4 pb-nav ${notice || updateReady ? "pt-4" : "pt-safe"}`,
						children: [
							view === "hoy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Today, {
								onOpen: setEditor,
								go
							}) : null,
							view === "colegio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(School, { onOpen: setEditor }) : null,
							view === "agenda" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Agenda, { onOpen: setEditor }) : null,
							view === "vida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vida, { onOpen: setEditor }) : null,
							view !== "hoy" && view !== "colegio" && view !== "agenda" && view !== "vida" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Extra, {
								view,
								go,
								onOpen: setEditor
							}) : null
						]
					}),
					showFab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none fixed inset-x-0 bottom-[calc(4.6rem+env(safe-area-inset-bottom))] z-30 mx-auto flex w-full max-w-lg justify-end px-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Nueva actividad",
							onClick: () => setEditor({ kind: "rapido" }),
							className: "pointer-events-auto grid size-14 place-items-center rounded-full bg-sage text-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-6" })
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "fixed inset-x-0 bottom-0 z-30 flex justify-center",
						"aria-label": "Principal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex w-full max-w-lg border-t border-line bg-paper pb-[max(0.25rem,env(safe-area-inset-bottom))]",
							children: NAV.map((item) => {
								const on = view === item.id || item.id === "mas" && ![
									"hoy",
									"colegio",
									"agenda",
									"vida"
								].includes(view);
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => go(item.id),
									className: `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs ${on ? "text-sage" : "text-ink-soft"}`,
									"aria-current": on ? "page" : void 0,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
								}, item.id);
							})
						})
					})
				] })
			}),
			editor ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorHost, {
				editor,
				onClose: () => setEditor(null),
				onOpen: setEditor
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "top-center" })
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeApp, {});
}
//#endregion
export { routes_Bw7mUyLN_exports as a, Home as component, showLocalNotice as i, isStandalone as n, notificationsSupported as r, isIos as t };
