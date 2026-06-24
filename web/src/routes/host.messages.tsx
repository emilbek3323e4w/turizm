import { useI18n } from "@/lib/i18n";

export default function PageStub() {
  const { t } = useI18n();
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">{t("host.navMessages")}</h1>
      <p className="mt-2 text-muted-foreground">{t("common.inDevelopment")}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-dashed border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}
