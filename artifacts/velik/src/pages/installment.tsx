import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { defaultInstallmentContent, type InstallmentPageContent } from "@/lib/installment-content";

export default function Installment() {
  const [content, setContent] = useState<InstallmentPageContent>(defaultInstallmentContent);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/installment-page")
      .then((res) => (res.ok ? res.json() : defaultInstallmentContent))
      .then((data) => {
        if (!cancelled) setContent({ ...defaultInstallmentContent, ...data });
      })
      .catch(() => {
        if (!cancelled) setContent(defaultInstallmentContent);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <CreditCard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">{content.heading}</h1>
            <p className="mt-2 text-muted-foreground">{content.subtitle}</p>
          </div>
        </div>

        <section className="glass-card mb-8 rounded-3xl p-6 md:p-8">
          <p className="text-lg leading-8 text-white/90">{content.lead}</p>
          <h2 className="mt-8 text-2xl font-bold uppercase tracking-wide text-primary">{content.highlightTitle}</h2>
          <p className="mt-4 leading-8 text-muted-foreground">{content.highlightText}</p>
        </section>

        <div className="space-y-8">
          {content.programs.map((program) => (
            <section key={program.title} className="glass-card rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white">{program.title}</h2>
              <p className="mt-4 leading-8 text-muted-foreground">{program.intro}</p>
              <div className="my-6 rounded-2xl bg-white/0 p-0">
                <img src={program.image} alt={program.imageAlt} className="h-auto max-h-72 w-full max-w-xl object-contain object-left" />
              </div>
              {program.caption && <p className="mb-4 font-medium text-white/90">{program.caption}</p>}
              <div className="space-y-4 text-muted-foreground">
                {program.body.map((paragraph) => (
                  <p key={paragraph} className="leading-8">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
