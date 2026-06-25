import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Building2, Bed, Calendar, TrendingUp, Star, Loader2 } from "lucide-react";
import { getAdminDashboard, type AdminDashboard } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

export default function AdminDashboardPage() {
  const { t } = useI18n();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch((err) => console.error("[admin.index] load failed", err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { label: t("ad.statUsers"), value: String(data.users_count), icon: Users },
        { label: t("ad.statHotels"), value: String(data.hotels_count), icon: Building2 },
        { label: t("ad.statRooms"), value: String(data.rooms_count), icon: Bed },
        { label: t("ad.statBookings"), value: String(data.bookings_count), icon: Calendar },
        { label: t("ad.statRating"), value: data.average_rating.toFixed(1), icon: Star },
        {
          label: t("ad.statRevenue"),
          value: `${data.total_revenue.toLocaleString("ru-RU")} ${t("common.kgs")}`,
          icon: TrendingUp,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-extrabold">{t("ad.navDashboard")}</h1>
        <p className="mt-1 text-muted-foreground">{t("ad.dashSubtitle")}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("ho.loading")}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-display text-lg font-bold">{t("ad.popular")}</h2>
            <div className="mt-4 divide-y divide-border/60">
              {(data?.popular_hotels ?? []).map((h, i) => (
                <div key={h.hotel_id} className="flex items-center gap-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                    {i + 1}
                  </span>
                  <Link to={`/estates/${h.hotel_id}`} className="flex-1 font-semibold hover:text-primary">
                    {h.name}
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {h.bookings_count} · ⭐ {h.rating.toFixed(1)}
                  </span>
                </div>
              ))}
              {(data?.popular_hotels ?? []).length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t("ad.bookingsEmpty")}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
