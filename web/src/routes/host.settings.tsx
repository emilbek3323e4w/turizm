import { useState } from "react";
import { ImageIcon, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";

type TabKey = "info" | "amenities" | "photos";

const TYPE_KEYS = ["hs.typeHotel", "hs.typeHotel2", "hs.typeHostel", "hs.typeCottage", "hs.typeGuest"];
const AMENITY_KEYS = [
  "hs.amWifi",
  "hs.amParking",
  "hs.amAc",
  "hs.amPool",
  "hs.amRestaurant",
  "hs.amTransfer",
  "hs.amSauna",
  "hs.amPlayground",
];

export default function HostSettings() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabKey>("info");
  const [selected, setSelected] = useState<string[]>(["hs.amWifi", "hs.amParking", "hs.amSauna"]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "info", label: t("hs.tabInfo") },
    { key: "amenities", label: t("hs.tabAmenities") },
    { key: "photos", label: t("hs.tabPhotos") },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">{t("hs.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("hs.subtitle")}</p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border/70 pb-3">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === tb.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border/70 bg-card p-6">
        {tab === "info" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("hs.hotelName")}>
              <Input placeholder={t("hs.hotelName")} />
            </Field>
            <Field label={t("hs.objectType")}>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                {TYPE_KEYS.map((k) => (
                  <option key={k}>{t(k)}</option>
                ))}
              </select>
            </Field>
            <Field label={t("hs.address")}>
              <Input placeholder={t("hs.address")} />
            </Field>
            <Field label={t("hs.coords")}>
              <Input placeholder="41.8500, 71.9500" />
            </Field>
            <Field label={t("hs.phone")}>
              <Input placeholder="+996 700 00 00 00" />
            </Field>
            <Field label="WhatsApp">
              <Input placeholder="+996 700 00 00 00" />
            </Field>
            <Field label={t("hs.email")}>
              <Input placeholder="hotel@example.com" />
            </Field>
            <div />
            <Field label={t("hs.checkIn")}>
              <Input type="time" defaultValue="14:00" />
            </Field>
            <Field label={t("hs.checkOut")}>
              <Input type="time" defaultValue="12:00" />
            </Field>
            <div className="sm:col-span-2">
              <Field label={t("hs.desc")}>
                <Textarea rows={4} placeholder={t("hs.desc")} />
              </Field>
            </div>
          </div>
        )}

        {tab === "amenities" && (
          <div className="flex flex-wrap gap-2">
            {AMENITY_KEYS.map((k) => {
              const active = selected.includes(k);
              return (
                <button
                  key={k}
                  onClick={() =>
                    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
                  }
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {active && <Check className="h-4 w-4" />} {t(k)}
                </button>
              );
            })}
          </div>
        )}

        {tab === "photos" && (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface p-12 transition hover:border-primary hover:bg-accent/40">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </span>
            <span className="inline-flex items-center gap-2 font-semibold text-primary">
              <Upload className="h-4 w-4" /> {t("hs.uploadPhotos")}
            </span>
            <input type="file" multiple accept="image/*" className="hidden" />
          </label>
        )}
      </div>

      <Button size="lg" className="mt-6 rounded-xl">
        {t("hs.save")}
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}
