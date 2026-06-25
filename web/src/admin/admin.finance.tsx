import { useEffect, useState } from "react";
import { Wallet, Percent, Calendar, Loader2 } from "lucide-react";
import { getAdminDashboard, type AdminDashboard } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export default function AdminFinance() {
  const { t } = useI18n();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => console.error("[admin.finance] load failed", err))
      .finally(() => setLoading(false));
  }, []);

  const kgs = t("common.kgs");
  const revenue = data?.total_revenue ?? 0;
  const stats = [
    { label: t("ad.finTotal"), value: `${revenue.toLocaleString("ru-RU")} ${kgs}`, icon: Wallet },
    {
      label: t("ad.finCommission"),
      value: `${Math.round(revenue * 0.1).toLocaleString("ru-RU")} ${kgs}`,
      icon: Percent,
    },
    { label: t("ad.statBookings"), value: String(data?.bookings_count ?? 0), icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{t("ad.navFinance")}</h1>
        <p className="mt-1 text-muted-foreground">{t("ad.financeSubtitle")}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("ho.loading")}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="mt-4 font-display text-2xl font-extrabold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
