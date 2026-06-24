import { useI18n } from "@/lib/i18n";

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const statuses: ("free" | "booked" | "checked")[] = days.map((d) =>
  d % 7 === 0 ? "checked" : d % 3 === 0 ? "booked" : "free",
);

const WEEKDAY_KEYS = ["hc.mon", "hc.tue", "hc.wed", "hc.thu", "hc.fri", "hc.sat", "hc.sun"];

export default function HostCalendar() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">{t("hc.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("hc.subtitle")}</p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Legend color="bg-success" label={t("hc.free")} />
        <Legend color="bg-warning" label={t("hc.booked")} />
        <Legend color="bg-destructive" label={t("hc.occupied")} />
      </div>

      <div className="mt-6 grid grid-cols-7 gap-2 rounded-2xl border border-border/70 bg-card p-4">
        {WEEKDAY_KEYS.map((k) => (
          <div
            key={k}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t(k)}
          </div>
        ))}
        {days.map((d, i) => {
          const s = statuses[i];
          const color =
            s === "free"
              ? "bg-success/10 text-success border-success/30"
              : s === "booked"
                ? "bg-warning/15 text-warning-foreground border-warning/30"
                : "bg-destructive/10 text-destructive border-destructive/30";
          return (
            <div
              key={d}
              className={`flex aspect-square flex-col items-start justify-between rounded-xl border p-2 text-xs ${color}`}
            >
              <span className="font-bold text-foreground">{d}</span>
              <span className="text-[10px] uppercase">
                {s === "free" ? "🟢" : s === "booked" ? "🟡" : "🔴"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} /> {label}
    </div>
  );
}
