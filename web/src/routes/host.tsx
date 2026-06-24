import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Bed,
  Calendar,
  CalendarDays,
  Star,
  Wallet,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/host", labelKey: "host.navDashboard", icon: LayoutDashboard, exact: true },
  { to: "/host/objects", labelKey: "host.navObjects", icon: Home },
  { to: "/host/rooms", labelKey: "host.navRooms", icon: Bed },
  { to: "/host/bookings", labelKey: "host.navBookings", icon: Calendar },
  { to: "/host/calendar", labelKey: "host.navCalendar", icon: CalendarDays },
  { to: "/host/reviews", labelKey: "host.navReviews", icon: Star },
  { to: "/host/finance", labelKey: "host.navFinance", icon: Wallet },
  { to: "/host/settings", labelKey: "host.navSettings", icon: Building2 },
];

export default function HostLayout() {
  const { t } = useI18n();
  const { user } = useAuth();
  const pathname = useLocation().pathname;
  useDocumentTitle(t("host.docTitle"));
  return (
    <AppShell>
      <div className="container-app grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border/70 bg-card p-3">
            <div className="px-3 py-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("host.panelLabel")}
              </div>
              <div className="mt-0.5 font-display text-base font-bold">
                {user?.name ?? t("nav.host")}
              </div>
            </div>
            <nav className="mt-2 space-y-0.5">
              {nav.map((n) => {
                const active = n.exact
                  ? pathname === n.to
                  : pathname.startsWith(n.to) && n.to !== "/host";
                const isHost = pathname === "/host" && n.exact;
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active || isHost
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <n.icon className="h-4 w-4" />
                    {t(n.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </AppShell>
  );
}
