import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, ImageIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listReceptionHotels, getHotelRooms, type RoomResponse } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

const ROOM_TYPE_KEYS = [
  "hrm.typeStandard",
  "hrm.typeSemiLux",
  "hrm.typeLux",
  "hrm.typeFamily",
  "hrm.typeDorm",
];
const ROOM_AMENITY_KEYS = [
  "hrm.amWifi",
  "hrm.amTv",
  "hrm.amAc",
  "hrm.amShower",
  "hrm.amBalcony",
  "hrm.amFridge",
  "hrm.amKitchen",
];

export default function HostRooms() {
  const { t } = useI18n();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const hotels = await listReceptionHotels();
        const all: RoomResponse[] = [];
        for (const h of hotels) all.push(...(await getHotelRooms(h.id).catch(() => [])));
        if (active) setRooms(all);
      } catch (err) {
        console.error("[host.rooms] load failed", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold">{t("hrm.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("hrm.subtitle")}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2 rounded-xl">
          <Plus className="h-4 w-4" /> {t("hrm.add")}
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {t("ho.loading")}
        </div>
      ) : rooms.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
          {t("hrm.empty")}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {rooms.map((r) => {
            const cover = r.images.find((i) => i.is_main)?.url ?? r.images[0]?.url;
            return (
              <div
                key={r.id}
                className="grid gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[160px_1fr_auto]"
              >
                {cover ? (
                  <img
                    src={cover}
                    alt=""
                    loading="lazy"
                    className="h-28 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-full items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground">
                    {t("ho.noPhoto")}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                      {r.type}
                    </span>
                    <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                      {t("hrm.available")}
                    </span>
                  </div>
                  <div className="mt-2 font-display text-lg font-bold">{r.name}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    <span>
                      👤 {t("hrm.upTo", { n: r.capacity_adults + r.capacity_children })}
                    </span>
                    <span>
                      {Number(r.price_per_night).toLocaleString("ru-RU")} {t("common.kgs")} /{" "}
                      {t("hrm.perNight")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary"
                    aria-label={t("ho.edit")}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-destructive hover:border-destructive"
                    aria-label={t("ho.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold">{t("hrm.addTitle")}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:border-primary"
                aria-label={t("hrm.close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label={t("hrm.number")}>
                <Input placeholder="101" />
              </Field>
              <Field label={t("hrm.name")}>
                <Input placeholder={t("hrm.namePh")} />
              </Field>
              <Field label={t("hrm.type")}>
                <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {ROOM_TYPE_KEYS.map((k) => (
                    <option key={k}>{t(k)}</option>
                  ))}
                </select>
              </Field>
              <Field label={t("hrm.price")}>
                <Input type="number" placeholder="3500" />
              </Field>
              <Field label={t("hrm.adults")}>
                <Input type="number" defaultValue="2" min={1} />
              </Field>
              <Field label={t("hrm.children")}>
                <Input type="number" defaultValue="0" min={0} />
              </Field>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("hrm.amenities")}
              </div>
              <div className="flex flex-wrap gap-2">
                {ROOM_AMENITY_KEYS.map((k) => {
                  const label = t(k);
                  const active = selected.includes(k);
                  return (
                    <button
                      key={k}
                      onClick={() =>
                        setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <Field label={t("hrm.descLabel")}>
                <Textarea rows={4} placeholder={t("hrm.descPh")} />
              </Field>
            </div>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("hrm.photos")}
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-surface p-8 transition hover:border-primary hover:bg-accent/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  <Upload className="h-4 w-4" /> {t("hrm.uploadPhoto")}
                </span>
                <input type="file" multiple accept="image/*" className="hidden" />
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-border/70 pt-5">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t("hrm.cancel")}
              </Button>
              <Button onClick={() => setShowForm(false)} className="rounded-xl">
                {t("hrm.save")}
              </Button>
            </div>
          </div>
        </div>
      )}
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
