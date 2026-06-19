import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play, ShoppingBag, Tag, Wrench, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    badge: "YouTube",
    title: "НАШ YOUTUBE-КАНАЛ",
    description: "Честные обзоры, сравнения и полезные гайды по настройке на нашем официальном канале.",
    cta: "Смотреть видео",
    ctaHref: "https://www.youtube.com/@VeloDream-p8z",
    ctaExternal: true,
    Icon: Play,
    gradient: "from-[#1a0533] via-[#2d0a5e] to-[#0d0220]",
    glow: "bg-primary/30",
    accentColor: "#a78bfa",
    btnClass: "bg-primary hover:bg-primary/80 shadow-[0_0_20px_rgba(90,49,255,0.5)]",
  },
  {
    id: 2,
    badge: "2026",
    title: "НОВАЯ КОЛЛЕКЦИЯ",
    description: "Электровелосипеды и самокаты нового поколения. Больше мощности, дальше заряда, стильнее дизайн.",
    cta: "В каталог",
    ctaHref: "/catalog",
    ctaExternal: false,
    Icon: ShoppingBag,
    gradient: "from-[#001a33] via-[#002952] to-[#000d1a]",
    glow: "bg-cyan-500/25",
    accentColor: "#22d3ee",
    btnClass: "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]",
  },
  {
    id: 3,
    badge: "Скидки",
    title: "СЕЗОННЫЕ СКИДКИ",
    description: "До 30% на популярные модели. Успейте купить любимый велосипед или самокат по лучшей цене сезона.",
    cta: "Смотреть акции",
    ctaHref: "/promotions",
    ctaExternal: false,
    Icon: Tag,
    gradient: "from-[#1a0a00] via-[#2e1600] to-[#0d0500]",
    glow: "bg-orange-500/20",
    accentColor: "#fb923c",
    btnClass: "bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
  },
  {
    id: 4,
    badge: "Сервис",
    title: "ПРОФЕССИОНАЛЬНАЯ СБОРКА",
    description: "Каждый велосипед собирается нашими мастерами. Настройка, регулировка и тест-драйв включены.",
    cta: "Узнать подробнее",
    ctaHref: "/repair",
    ctaExternal: false,
    Icon: Wrench,
    gradient: "from-[#001a10] via-[#00291a] to-[#000d08]",
    glow: "bg-green-500/20",
    accentColor: "#4ade80",
    btnClass: "bg-green-600 hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]",
  },
  {
    id: 5,
    badge: "Рассрочка",
    title: "ПОКУПКА В РАССРОЧКУ",
    description: "Не откладывай мечту — бери сейчас, плати удобно. Рассрочка 0% на все модели от 3 до 24 месяцев.",
    cta: "Рассчитать рассрочку",
    ctaHref: "/installment",
    ctaExternal: false,
    Icon: CreditCard,
    gradient: "from-[#1a001a] via-[#2d002d] to-[#0d000d]",
    glow: "bg-pink-500/20",
    accentColor: "#f472b6",
    btnClass: "bg-pink-600 hover:bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]",
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      emblaApi?.scrollNext();
    }, 5000);
  }, [emblaApi, stopAutoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    startAutoplay();
    return () => stopAutoplay();
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    startAutoplay();
  }, [emblaApi, startAutoplay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    startAutoplay();
  }, [emblaApi, startAutoplay]);

  const scrollTo = useCallback((i: number) => {
    emblaApi?.scrollTo(i);
    startAutoplay();
  }, [emblaApi, startAutoplay]);

  return (
    <div className="container mx-auto px-4 pt-16 pb-6">
    <section className="relative w-full overflow-hidden rounded-2xl" style={{ height: "560px" }}>
      <div ref={emblaRef} className="h-full overflow-hidden rounded-2xl">
        <div className="flex h-full">
          {slides.map((s) => {
            const Icon = s.Icon;
            return (
              <div
                key={s.id}
                className={`relative flex-[0_0_100%] h-full bg-gradient-to-br ${s.gradient} overflow-hidden`}
              >
                {/* Glow orbs */}
                <div className={`absolute top-[-20%] left-[15%] w-[400px] h-[400px] rounded-full ${s.glow} blur-[100px] opacity-70 pointer-events-none`} />
                <div className={`absolute bottom-[-30%] right-[5%] w-[300px] h-[300px] rounded-full ${s.glow} blur-[120px] opacity-40 pointer-events-none`} />

                {/* Right image panel with diagonal clip */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-[55%]"
                  style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                  <img
                    src="/hero-bike.png"
                    alt=""
                    className="w-full h-full object-contain object-center opacity-60 scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                </div>

                {/* Left fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="px-8 md:px-16 max-w-[52%]">
                    <div
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4"
                      style={{ color: s.accentColor }}
                    >
                      <Icon className="h-3 w-3" />
                      {s.badge}
                    </div>
                    <h2
                      className="text-3xl md:text-5xl font-display font-black tracking-tight text-white mb-4 leading-tight"
                      style={{ color: s.accentColor, textShadow: `0 0 60px ${s.accentColor}55` }}
                    >
                      {s.title}
                    </h2>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6 max-w-md">
                      {s.description}
                    </p>
                    {s.ctaExternal ? (
                      <a href={s.ctaHref} target="_blank" rel="noopener noreferrer">
                        <Button className={`${s.btnClass} text-white flex items-center gap-2 h-11 px-6 rounded-lg text-sm font-semibold`}>
                          <Icon className="h-4 w-4" />
                          {s.cta}
                        </Button>
                      </a>
                    ) : (
                      <Link href={s.ctaHref}>
                        <Button className={`${s.btnClass} text-white flex items-center gap-2 h-11 px-6 rounded-lg text-sm font-semibold`}>
                          <Icon className="h-4 w-4" />
                          {s.cta}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev arrow */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`transition-all rounded-full ${
              i === selectedIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
    </div>
  );
}
