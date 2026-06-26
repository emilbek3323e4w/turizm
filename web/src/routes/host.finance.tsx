import { useEffect, useState } from "react";
import { Wallet, Calendar, PiggyBank, Loader2 } from "lucide-react";
import { listReceptionHotels, getReceptionFinance } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

interface Fin {
  today: number;
  week: number;
  month: number;
  bookings: number;
  deposits: number;
}

export default function HostFinance() {
  const { t } = useI18n();
  const [fin, setFin] = useState<Fin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const hotels = await listReceptionHotels();
        const all = await Promise.all(
          hotels.map((h) => getReceptionFinance(h.id).catch(() => null)),
        );
        const ok = all.filter((f): f is NonNullable<typeof f> => f !== null);
        const sum = (g: (f: (typeof ok)[number]) => number) => ok.reduce((a, f) => a + g(f), 0);
        setFin({
          today: sum((f) => f.revenue_today),
          week: sum((f) => f.revenue_week),
          month: sum((f) => f.revenue_month),
          bookings: sum((f) => f.bookings_count),
          deposits: sum((f) => f.deposits_total),
        });
      } catch (err) {
        console.error("[host.finance] load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const kgs = t("common.kgs");
  const money = (n: number) => `${n.toLocaleString("ru-RU")} ${kgs}`;

  const periods = fin
    ? [
        { label: t("hf.day"), value: money(fin.today), icon: Wallet },
        { label: t("hf.week"), value: money(fin.week), icon: Wallet },
        { label: t("hf.month"), value: money(fin.month), icon: Wallet },
      ]
    : [];
  const extra = fin
    ? [
        { label: t("hf.bookingsCount"), value: String(fin.bookings), icon: Calendar },
        { label: t("hf.deposits"), value: money(fin.deposits), icon: PiggyBank },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{t("hf.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("hf.subtitle")}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("ho.loading")}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {periods.map((p) => (
              <div key={p.label} className="rounded-2xl border border-border/70 bg-card p-5">
                <div className="flex items-center gap-1 text-xs font-semibold text-success">
                  <Wallet className="h-3 w-3" /> {t("hf.revenue")}
                </div>
                <div className="mt-3 font-display text-2xl font-extrabold">{p.value}</div>
                <div className="text-sm text-muted-foreground">{p.label}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {extra.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-2xl font-extrabold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
