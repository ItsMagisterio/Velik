import { Truck, CreditCard, Shield, MapPin, Package, Wrench, Clock, Globe } from "lucide-react";

const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const allDays = [0, 1, 2, 3, 4, 5, 6];
const weekendDays = [5, 6];

function DayBadges({ activeDays }: { activeDays: number[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {days.map((day, i) => (
        <span
          key={day}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold ${
            activeDays.includes(i)
              ? "bg-primary text-white"
              : "bg-white/5 text-muted-foreground"
          }`}
        >
          {day}
        </span>
      ))}
    </div>
  );
}

const deliveryMethods = [
  {
    icon: Truck,
    title: "Доставка по городу",
    description:
      "Наша собственная курьерская служба доставит ваш заказ в любую точку города. Заказы до 14:00 привозим в тот же день! Время доставки согласовывается индивидуально.",
    price: "Бесплатно",
    priceClass: "text-primary",
  },
  {
    icon: Package,
    title: "Доставка по Беларуси",
    description:
      "Отправляем заказы быстрой курьерской службой прямо до вашего дома по всей стране. Срок доставки — как правило, уже на следующий день.",
    price: "от 0 до 20 руб.",
    priceClass: "text-white",
  },
  {
    icon: MapPin,
    title: "Самовывоз",
    description:
      "Вы можете лично забрать и осмотреть ваш заказ в нашем магазине. Адрес: Центральная площадь, д.1, вход с торца. Пожалуйста, согласуйте время визита с менеджером.",
    price: "Бесплатно",
    priceClass: "text-primary",
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Наличными или картой курьеру",
    description:
      "Самый простой способ: оплатите заказ наличными или банковской картой нашему курьеру при получении. Действует для доставки по городу и всей Беларуси.",
  },
  {
    icon: CreditCard,
    title: "Онлайн-оплата",
    description:
      "Оплачивайте заказ онлайн через защищённый сервис. Доступно при оформлении через корзину сайта — просто выберите соответствующий пункт.",
  },
  {
    icon: CreditCard,
    title: "Покупка в рассрочку",
    description:
      "Приобретайте велосипед мечты уже сегодня! У нас действуют выгодные программы рассрочки. Для оформления сообщите об этом менеджеру.",
  },
];

const serviceItems = [
  {
    icon: Shield,
    title: "Гарантийный ремонт",
    description:
      "Мы предоставляем полную официальную гарантию на все велосипеды. При возникновении гарантийного случая обращайтесь в наш магазин по адресу: Центральная площадь, д.1.",
  },
  {
    icon: Wrench,
    title: "ТО и послегарантийный ремонт",
    description:
      "Для планового технического обслуживания и любого ремонта после окончания гарантии обращайтесь к нашим мастерам непосредственно в магазин.",
  },
];

export default function Delivery() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-12 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Truck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Оплата и доставка</h1>
            <p className="mt-2 text-muted-foreground">
              Мы сделали процесс покупки максимально простым и удобным
            </p>
          </div>
        </div>

        {/* Schedule block */}
        <section className="glass-card mb-10 rounded-3xl p-6 md:p-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Order processing */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                  Обработка заказов
                </h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-mono text-white/80">
                  08:00 – 23:00
                </span>
                <DayBadges activeDays={allDays} />
              </div>
            </div>

            {/* Delivery schedule */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                  Доставка заказов
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-mono text-white/80">
                    08:00 – 23:00
                  </span>
                  <DayBadges activeDays={allDays} />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-mono text-white/80">
                    09:00 – 23:00
                  </span>
                  <DayBadges activeDays={weekendDays} />
                </div>
              </div>
            </div>

            {/* Geography */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
                  География доставки
                </h3>
              </div>
              <p className="text-white/80">Вся Беларусь</p>
            </div>
          </div>
        </section>

        {/* Delivery methods */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Способы доставки
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {deliveryMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="glass-card flex flex-col rounded-2xl p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                    {method.title}
                  </h3>
                  <p className="flex-1 text-sm leading-6 text-muted-foreground">
                    {method.description}
                  </p>
                  <div className="mt-5">
                    <span
                      className={`inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold ${method.priceClass}`}
                    >
                      {method.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment methods */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Способы оплаты
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="glass-card flex flex-col rounded-2xl p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                    {method.title}
                  </h3>
                  <p className="flex-1 text-sm leading-6 text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Guarantee & service */}
        <section>
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-primary">
            Гарантия и сервис
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {serviceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="glass-card flex flex-col rounded-2xl p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
