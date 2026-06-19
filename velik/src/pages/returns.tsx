import { Shield, Clock, XCircle, Info, RefreshCw, AlertTriangle, Eye, Wrench, HelpCircle } from "lucide-react";

export default function Returns() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <RefreshCw className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Обмен и возврат товара</h1>
            <p className="mt-2 text-muted-foreground">Простые и честные правила</p>
          </div>
        </div>

        {/* Hero card */}
        <section className="glass-card mb-10 rounded-3xl p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Shield className="h-7 w-7" />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-white">
            Ваша уверенность в каждой покупке
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground leading-7">
            Мы хотим, чтобы каждая поездка на велосипеде приносила только радость. Здесь мы просто
            и честно рассказываем о правилах гарантии, обмена и возврата, чтобы вы были уверены в
            своём выборе.
          </p>
        </section>

        {/* Guarantee section */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Наша гарантия — ваше спокойствие
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                На что действует?
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Фирменная гарантия производителя распространяется на <strong className="text-white/80">раму</strong> и{" "}
                <strong className="text-white/80">навесное оборудование</strong> велосипеда.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                Как долго?
              </h3>
              <div className="text-sm leading-7 text-muted-foreground space-y-1">
                <p><strong className="text-white/80">Рама:</strong> от 1 до 5 лет.</p>
                <p><strong className="text-white/80">Оборудование:</strong> от 6 до 12 месяцев.</p>
                <p>Точные сроки зависят от производителя и указаны в документации к вашему велосипеду.</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                Что не входит?
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Гарантия не распространяется на расходные материалы:{" "}
                <strong className="text-white/80">покрышки, камеры, педали</strong> и другие детали,
                подверженные естественному износу.
              </p>
            </div>
          </div>
        </section>

        {/* What you need */}
        <section className="mb-10">
          <div className="glass-card rounded-2xl border border-primary/20 p-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-primary">
                  Что нужно для обращения?
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  Для гарантийного обслуживания вам понадобится только{" "}
                  <strong className="text-white/80">гарантийный талон</strong> с датой продажи и
                  печатью магазина. Наличие чека или коробки не обязательно.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange rules */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary flex items-center gap-2">
            <RefreshCw className="h-6 w-6" />
            Прозрачные правила обмена и возврата
          </h2>
          <div className="space-y-4">

            <div className="glass-card rounded-2xl border border-primary/10 p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                    Если обнаружен заводской брак
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Если вы обнаружили производственный дефект, мы без вопросов{" "}
                    <strong className="text-white/80">заменим товар на новый или вернём вам деньги</strong>.
                    Все расходы по доставке в этом случае мы берём на себя.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                    Если товар надлежащего качества
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    В соответствии с законодательством РБ, велосипед как технически сложный товар
                    надлежащего качества{" "}
                    <strong className="text-white/80">обмену и возврату не подлежит</strong>.
                    Пожалуйста, отнеситесь к выбору модели и размера внимательно.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">
                    Пожалуйста, будьте внимательны при получении!
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Это самый важный момент.{" "}
                    <strong className="text-white/80">
                      Внимательно осмотрите велосипед на предмет царапин, вмятин и проверьте
                      комплектацию в присутствии курьера.
                    </strong>{" "}
                    После того как вы приняли заказ и курьер уехал, претензии по внешнему виду и
                    комплектации не принимаются.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Where to go */}
        <section>
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Куда обращаться за помощью?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                Гарантийный ремонт
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                По всем вопросам, связанным с гарантией, обращайтесь в наш основной сервисный центр
                по адресу:
              </p>
              <p className="mt-3 font-semibold text-white">
                Центральная площадь, д.1 — вход с торца
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                Послегарантийный ремонт
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Для планового технического обслуживания и любого ремонта после окончания гарантии
                обращайтесь непосредственно к нам в магазин.
              </p>
              <p className="mt-3 font-semibold text-white">
                Центральная площадь, д.1
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
