import { Link } from "react-router-dom";
import { Home, Calendar, Wallet, Star, TrendingUp, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function HostDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  const stats = [
    { label: t("hi.objects"), value: "3", icon: Home, trend: t("hi.objectsTrend") },
    { label: t("hi.activeBookings"), value: "12", icon: Calendar, trend: t("hi.activeTrend") },
    {
      label: t("hi.monthRevenue"),
      value: `184 500 ${t("common.kgs")}`,
      icon: Wallet,
      trend: "+18%",
    },
    { label: t("hi.avgRating"), value: "4.8", icon: Star, trend: t("hi.outOf5") },
  ];

  const recent = [
    { g: t("hb.guestN", { id: 1 }), r: t("hi.sampleRoom1"), d: "10–14", s: t("hb.tabNew") },
    { g: t("hb.guestN", { id: 2 }), r: t("hi.sampleRoom2"), d: "15–17", s: t("hb.tabConfirmed") },
    { g: t("hb.guestN", { id: 3 }), r: t("hi.sampleRoom1"), d: "20–22", s: t("hb.tabCheckedIn") },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">
            {t("hi.welcome", { name: user?.name ?? "" })} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">{t("hi.subtitle")}</p>
        </div>
        <Link
          to="/host/objects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-pop)]"
        >
          {t("ho.add")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
              </span>
            </div>
            <div className="mt-4 font-display text-2xl font-extrabold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{t("hi.recentBookings")}</h2>
            <Link
              to="/host/bookings"
              className="text-sm font-semibold text-primary hover:underline"
            >
              {t("popular.all")}
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border/60">
            {recent.map((b, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-semibold">{b.g}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.r} · {b.d}
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                  {b.s}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6">
          <h2 className="font-display text-lg font-bold">{t("hi.occupancy")}</h2>
          <div className="mt-4">
            <div className="font-display text-4xl font-extrabold">72%</div>
            <div className="text-sm text-muted-foreground">{t("hi.thisMonth")}</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: "72%" }} />
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <Row label={`🟢 ${t("hi.free")}`} value={t("hi.daysN", { n: 8 })} />
            <Row label={`🟡 ${t("hi.booked")}`} value={t("hi.daysN", { n: 14 })} />
            <Row label={`🔴 ${t("hi.occupied")}`} value={t("hi.daysN", { n: 8 })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
