import { Heart, Shield, Tag, Users, Wrench, Store, Send, Phone, Mail, MapPin, FileText } from "lucide-react";

const principles = [
  {
    icon: Shield,
    title: "Проверенное качество",
    description:
      "Мы предлагаем только те велосипеды, в которых уверены сами. Каждая модель отобрана за оптимальное соотношение цены, надёжности и качества компонентов.",
  },
  {
    icon: Tag,
    title: "Честная цена",
    description:
      "Мы работаем напрямую с поставщиками и оптимизируем расходы, чтобы предложить вам лучшие велосипеды по максимально доступным ценам, без скрытых наценок.",
  },
  {
    icon: Users,
    title: "Экспертная помощь",
    description:
      "Не знаете, какой велосипед выбрать? Наша команда — практикующие велосипедисты. Мы с радостью ответим на любые вопросы и поможем подобрать модель под ваш рост, стиль катания и бюджет.",
  },
  {
    icon: Wrench,
    title: "Полный сервис",
    description:
      "Каждый велосипед перед доставкой проходит профессиональную настройку. Мы доставляем по всей Беларуси и всегда готовы помочь с последующим обслуживанием.",
  },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/velo_dream_by/", color: "bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]" },
  { label: "VK", href: "https://vk.com/velo_dream_by", color: "bg-[#0077FF]" },
  { label: "Facebook", href: "https://www.facebook.com/remontveloMolodechno/", color: "bg-[#1877F2]" },
  { label: "YouTube", href: "https://www.youtube.com/@VeloDream-p8z", color: "bg-[#FF0000]" },
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">О магазине</h1>
            <p className="mt-2 text-muted-foreground">Больше, чем просто велосипеды</p>
          </div>
        </div>

        {/* Hero */}
        <section className="glass-card mb-10 rounded-3xl p-8">
          <div className="mb-5 flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold uppercase tracking-wide text-white">
              Больше, чем просто велосипеды
            </h2>
          </div>
          <p className="leading-8 text-muted-foreground">
            Мы — команда энтузиастов, для которых велосипед — это не просто товар, а символ свободы,
            здоровья и ярких эмоций. Наша миссия — сделать мир велоспорта доступным и понятным для
            каждого, от ребёнка, делающего первые обороты педалей, до опытного райдера.
          </p>
        </section>

        {/* Philosophy */}
        <section className="glass-card mb-10 rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Наша философия
          </h2>
          <div className="space-y-5 leading-8 text-muted-foreground">
            <p>
              Мы верим, что правильно подобранный велосипед способен изменить жизнь. Он открывает
              новые маршруты в вашем городе, дарит незабываемые впечатления от загородных поездок и
              укрепляет здоровье. Поэтому мы не просто «продаём велосипеды», а{" "}
              <strong className="text-white/90">
                помогаем найти вашего идеального двухколёсного друга
              </strong>
              .
            </p>
            <p>
              Каждая модель в нашем каталоге проходит тщательный отбор. Мы лично тестируем
              велосипеды, изучаем отзывы и работаем только с теми производителями, которые разделяют
              наши ценности:{" "}
              <strong className="text-white/90">
                надёжность, современные технологии и честная цена.
              </strong>
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Наши принципы
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="glass-card rounded-2xl p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{p.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Socials CTA */}
        <section className="glass-card mb-10 rounded-3xl p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold uppercase tracking-wide text-primary">
            Присоединяйтесь к нашему движению!
          </h2>
          <p className="mb-7 text-muted-foreground">
            Есть вопросы по выбору, настройке или просто хотите поделиться крутым маршрутом?
            Подписывайтесь и общайтесь с нами в мессенджерах!
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.color} inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90`}
              >
                <Send className="h-4 w-4" />
                {s.label}
              </a>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Или просто позвоните для консультации:{" "}
            <a href="tel:+375444558888" className="text-primary font-semibold hover:underline">
              +375 (44) 455-88-88
            </a>
          </p>
        </section>

        {/* Contacts quick */}
        <section className="glass-card mb-10 rounded-3xl p-8">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Как нас найти
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-primary mb-1">Адрес</p>
                <p className="text-sm text-muted-foreground">Центральная площадь, д.1<br />вход с торца</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-primary mb-1">Телефоны</p>
                <p className="text-sm text-muted-foreground">+375 44 455 88 88</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-primary mb-1">Email</p>
                <p className="text-sm text-muted-foreground">velo.dream.by@gmail.com</p>
              </div>
            </div>
          </div>
        </section>

        {/* Requisites */}
        <section className="glass-card rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold uppercase tracking-wide text-primary">Реквизиты</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            {[
              ["Индивидуальный предприниматель", "Мацко Владимир Владимирович"],
              ["ОКПО", "738138926000"],
              ["УНП", "692022235"],
              ["GLN", "4819303020006"],
              ["Регистрация в торговом реестре РБ", "№418857 от 20.06.2018"],
              ["Регистрация в реестре бытовых услуг", "№000000076238 от 25.05.2018"],
              ["Юридический адрес", "Центральная площадь, д.1"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-2">
                <span className="font-semibold text-white/70 shrink-0">{label}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
